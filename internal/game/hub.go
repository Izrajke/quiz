package game

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"quiz/internal/taskpool"
	"strconv"
	"time"
)

// Hub хаб
type Hub struct {
	ctx context.Context

	// регистрируемые соединения
	Register chan Subscription
	// полученные сообщения
	Broadcast chan Message
	// отключённые соединения
	Unregister chan Subscription

	// игры
	games map[string]*Game
	// события
	event *Event
	// воркер пул
	taskPool *taskpool.Pool
}

func NewHub(ctx context.Context, taskPool *taskpool.Pool) *Hub {
	return &Hub{
		ctx:        ctx,
		Register:   make(chan Subscription),
		Broadcast:  make(chan Message),
		Unregister: make(chan Subscription),
		games:      make(map[string]*Game),
		event:      NewEvent(),
		taskPool:   taskPool,
	}
}

func (h *Hub) Run() {
	for {
		select {
		// регистрация нового соединения
		case s := <-h.Register:
			// 1. получение объекта игры
			g := CreateOrGetGame(h.games, &s)
			// 2. инициализация игроков
			h.event.InitPlayers(g.Players).SendToAll(g.Players, s.Room, h.games)
			// 3. сборка карты
			h.event.BuildMap().SendToOne(g.Players, s.Room, s.Conn, h.games)
			// 4. запуск игры
			if g.IsFullPlayers() {
				// 5. инициализируем структуру для списка ответов на второй вопрос
				g.SecondAnswers = []*PlayerOption{}
				for _, player := range g.Players {
					playerOption := &PlayerOption{
						Color: player.Color,
						Name:  player.Name,
					}
					g.SecondAnswers = append(g.SecondAnswers, playerOption)
				}
				// 6. кол-во ходов для захвата
				h.event.NumberOfMovesForCapture().SendToAll(g.Players, s.Room, h.games)
				// 7. текущий ход
				h.event.CurrentMove(g.SecondQuestionCount+1).SendToAll(g.Players, s.Room, h.games)
				// 8. отправка вопроса
				h.event.SecondQuestion(GlobalSecondQuestions[g.SecondQuestionCount].Question).SendToAll(g.Players, s.Room, h.games)
				// 9. запоминаем время отправки
				g.SecondQuestionStartedAt = time.Now()
			}
		// получение сообщения от клиента
		case m := <-h.Broadcast:
			g, found := h.games[m.Room]
			if found {
				switch m.Request.Type {
				// получение ответа на вопрос
				case EventAnswerType:
					g.AnswerCount++

					// 1. этап захвата клеток
					if !g.IsAttack {
						// 2. запоминаем ответы игроков
						for _, option := range g.SecondAnswers {
							if m.PlayerColor == option.Color {
								value, _ := strconv.Atoi(m.Request.Option)
								option.Value = value
								answerSeconds := m.Time.Sub(g.SecondQuestionStartedAt).Seconds()
								option.Time = math.Round(answerSeconds*100) / 100
							}
						}
						// 3. все ответили
						if g.IsEveryoneAnswered() {
							g.AnswerCount = 0
							correctAnswer := GlobalSecondQuestions[g.SecondQuestionCount].Answer.Value

							// 4. правильный ответ
							h.event.AnswerSecondQuestion(g.SecondAnswers, correctAnswer).SendToAll(g.Players, m.Room, h.games)
							// 5. считаем кол-во клеток для выбора у каждого игрока
							selectCellCount := g.LenPlayers()
							for _, option := range g.SecondAnswers {
								g.SelectCellCount[option.Color] = selectCellCount
								selectCellCount--
							}
							// 6. отправляем одному игроку, что ему нужно выбрать клетки
							for color, count := range g.SelectCellCount {
								err := h.taskPool.AddTask(taskpool.NewTask(func(context.Context) {
									time.Sleep(5 * time.Second)
									h.event.SelectCell(color, count).SendToAll(g.Players, m.Room, h.games)
								}))
								if err != nil {
									fmt.Println("task pool fatal")
								}
								break
							}

							g.SecondQuestionCount++
							g.RoundCount++
						}
					} else {
						g.FirstAnswers[m.PlayerColor] = m.Request.Option

						if g.IsEveryoneAnswered() {
							g.AnswerCount = 0

							// отправка правильного ответа
							correctAnswer := GlobalFirstQuestions[g.FirstQuestionCount].Answer.Value
							h.event.AnswerFirstQuestion(correctAnswer).SendToAll(g.Players, m.Room, h.games)

							for playerColor, answer := range g.FirstAnswers {
								if answer == correctAnswer {

									GlobalMap[m.Request.RowIndex][m.Request.CellIndex].Owner = playerColor
									// сборка карты
									h.event.BuildMap().SendToAll(g.Players, m.Room, h.games)
									break
								}
							}
							g.FirstQuestionCount++
							g.RoundCount++

							if g.RoundCount == 4 {
								h.event.Finish().SendToAll(g.Players, m.Room, h.games)
							} else {
								err := h.taskPool.AddTask(taskpool.NewTask(func(context.Context) {
									// отправка вопроса
									time.Sleep(1 * time.Second)
									h.event.FirstQuestion(GlobalFirstQuestions[g.FirstQuestionCount].Question).SendToAll(g.Players, m.Room, h.games)
								}))
								if err != nil {
									fmt.Println("task pool fatal")
								}
							}
						}
					}
				case EventGetOrAttackCellType:
					if !g.IsAttack {
						count, found := g.SelectCellCount[m.PlayerColor]
						if found {

							// 1. считаем кол-во выбранных клеток у игрока
							count--
							g.SelectCellCount[m.PlayerColor] = count
							GlobalMap[m.Request.RowIndex][m.Request.CellIndex].Owner = m.PlayerColor
							g.FreeCellCounter--

							// 2. отправляем карту
							h.event.BuildMap().SendToAll(g.Players, m.Room, h.games)

							if g.FreeCellCounter == 0 {
								g.IsAttack = true

								colors := make([]string, 0)
								for _, player := range g.Players {
									colors = append(colors, player.Color)
								}
								moves := make([]string, 0)
								rand.Seed(time.Now().Unix())
								for i := 0; i < 10; i++ {
									rnd := rand.Intn(len(colors))
									value := colors[rnd]
									moves = append(moves, value)
								}
								// 3. текущий ход
								h.event.CurrentMove(g.FirstQuestionCount+1).SendToAll(g.Players, m.Room, h.games)
								// 4. порядок ходов для стадии атаки
								h.event.NumberOfMovesForAttack(moves).SendToAll(g.Players, m.Room, h.games)
								// 5. смена этапа игры
								h.event.AllowAttack(colors[0]).SendToAll(g.Players, m.Room, h.games)
							} else {
								if count == 0 {
									delete(g.SelectCellCount, m.PlayerColor)
									// 4. отправляем следующему игроку о том, что ему нужно выбрать клетки
									if len(g.SelectCellCount) > 0 {
										for color, selectCount := range g.SelectCellCount {
											h.event.SelectCell(color, selectCount).SendToAll(g.Players, m.Room, h.games)
											break
										}
									}
								}
								if len(g.SelectCellCount) == 0 {
									err := h.taskPool.AddTask(taskpool.NewTask(func(context.Context) {
										time.Sleep(1 * time.Second)
										// 5. текущий ход
										h.event.CurrentMove(g.RoundCount).SendToAll(g.Players, m.Room, h.games)
										// 6. отправка вопроса
										h.event.SecondQuestion(GlobalSecondQuestions[g.SecondQuestionCount].Question).SendToAll(g.Players, m.Room, h.games)
									}))
									if err != nil {
										fmt.Println("task pool fatal")
									}
								}
							}
						}
					} else {
						h.event.FirstQuestion(GlobalFirstQuestions[g.FirstQuestionCount].Question).SendToAll(g.Players, m.Room, h.games)
					}
				}
			}
		// отключение соединения
		case s := <-h.Unregister:
			g, found := h.games[s.Room]
			if found {
				colors := []string{s.Player.Color}
				colors = append(colors, g.Colors...)
				g.Colors = colors

				delete(g.Players, s.Conn)
				close(s.Conn.Send)
				if len(g.Players) == 0 {
					delete(h.games, s.Room)
				}
			}
		}
	}
}
