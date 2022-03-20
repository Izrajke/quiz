package internal

import (
	"context"
	"fmt"
	"math"
	"math/rand"
	"quiz/internal/domain"
	"quiz/internal/taskpool"
	"strconv"
	"time"
)

type message struct {
	data []byte
	room string
	// TODO may change for player id
	playerColor string
	request     *request
	time        time.Time
}

type subscription struct {
	conn   *domain.Connection
	room   string
	player *domain.Player
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// регистрируемые соединения
	register chan subscription

	// полученные сообщения
	broadcast chan message

	// отключённые соединения
	unregister chan subscription

	// игры
	games map[string]*gameStore

	// события
	event *domain.Event

	ctx      context.Context
	taskPool *taskpool.Pool
}

type gameStore struct {
	// состояние игры
	state int

	// счетчик вопросов
	questionCounter int
	// счетчик ответов
	answerCounter int
	// счетчик раундов
	roundCounter int
	// кол-во свободных клеток
	freeCellCounter int
	// доступное кол-во для выбора клеток
	selectCellCounter map[string]int

	// игроки, соединение - игрок
	players map[*domain.Connection]*domain.Player

	// ответы игроков на первый тип вопроса
	answers map[string]string
	// ответы игроков на второй тип вопроса
	secondAnswers []*domain.PlayerOption
	// время, когда отправили вопрос второго типа
	secondQuestionStartedAt time.Time

	// доступные цвета для игроков
	colors []string
}

func NewHub(ctx context.Context, taskPool *taskpool.Pool) *hub {
	return &hub{
		register:   make(chan subscription),
		broadcast:  make(chan message),
		unregister: make(chan subscription),
		// игры
		games: make(map[string]*gameStore),
		// события
		event:    domain.NewEvent(),
		ctx:      ctx,
		taskPool: taskPool,
	}
}

const (
	// максимальное кол-во игроков
	maxConnections = 2
)

func (h *hub) Run() {
	for {
		select {
		// регистрация нового соединения
		case s := <-h.register:
			game := h.createOrGetGame(&s)

			// 1. инициализация игроков
			msg := h.event.PlayersInfo(game.players).Marshal()
			h.sendToAll(game.players, s.room, msg)
			// 2. инициализация карты
			msg = h.event.MapInfo().Marshal()
			h.sendToOne(game.players, s.conn, s.room, msg)

			// 3. запуск игры
			if len(game.players) == maxConnections {
				// 4. кол-во ходов для захвата
				msg = h.event.CaptureTurnInfo().Marshal()
				h.sendToAll(game.players, s.room, msg)
				// 5. текущий ход
				msg = h.event.CurrentTurnInfo().Marshal()
				h.sendToAll(game.players, s.room, msg)
				// 6. отправка вопроса
				questionInfo := domain.GlobalSecondQuestions[game.questionCounter]
				msg = h.event.SecondQuestionInfo(questionInfo.Question).Marshal()
				h.sendToAll(game.players, s.room, msg)
				// 7. сохранили время отправки
				game.secondQuestionStartedAt = time.Now()
				// TODO подумать как сделать лучше
				// 8. инициализируем структуру для списка ответов на второй вопрос
				game.secondAnswers = []*domain.PlayerOption{}
				for _, player := range game.players {
					playerOption := &domain.PlayerOption{
						Color: player.Color,
						Name:  player.Name,
					}
					game.secondAnswers = append(game.secondAnswers, playerOption)
				}
			}
		case m := <-h.broadcast:
			game := h.games[m.room]

			var msg []byte
			switch m.request.Type {
			// получение ответа на вопрос
			case domain.EventReceivedAnswer:
				game.answerCounter++

				for _, option := range game.secondAnswers {
					if m.playerColor == option.Color {
						value, _ := strconv.Atoi(m.request.Option)
						option.Value = value
						answerSeconds := m.time.Sub(game.secondQuestionStartedAt).Seconds()
						option.Time = math.Round(answerSeconds*100) / 100
					}
				}
				if len(game.players) == game.answerCounter {
					game.answerCounter = 0

					if game.roundCounter == 4 {
						msg = h.event.FinishInfo().Marshal()
						h.sendToAll(game.players, m.room, msg)
					} else {
						questionInfo := domain.GlobalSecondQuestions[game.questionCounter]
						correctAnswer := questionInfo.Answer.Value

						answerMsg := h.event.AnswerSecondQuestionInfo(game.secondAnswers, correctAnswer).Marshal()
						h.sendToAll(game.players, m.room, answerMsg)

						game.answers = make(map[string]string, 0)
						game.questionCounter++

						err := h.taskPool.AddTask(taskpool.NewTask(func(context.Context) {
							time.Sleep(5 * time.Second)
							questionInfo = domain.GlobalSecondQuestions[game.questionCounter]
							msg = h.event.SecondQuestionInfo(questionInfo.Question).Marshal()
							h.sendToAll(game.players, m.room, msg)
							game.secondQuestionStartedAt = time.Now()
						}))
						if err != nil {
							fmt.Println("task pool fatal")
						}
					}
				}

				//game.answerCounter++
				//
				//// сохранение ответа игрока
				//game.answers[m.playerColor] = m.request.Option
				//// ожидание всех ответов
				//if len(game.players) == game.answerCounter {
				//	game.answerCounter = 0
				//
				//	if game.roundCounter == 4 {
				//		msg = h.event.FinishInfo().Marshal()
				//		h.sendToAll(game.players, m.room, msg)
				//	} else {
				//		// отправка правильного ответа
				//		questionInfo := domain.GlobalFirstQuestions[game.questionCounter]
				//		correctAnswer := questionInfo.Answer.Value
				//		answerMsg := h.event.AnswerFirstQuestionInfo(correctAnswer).Marshal()
				//		h.sendToAll(game.players, m.room, answerMsg)
				//
				//		var isCorrectAnswer bool
				//		for playerColor, answer := range game.answers {
				//			if answer == correctAnswer {
				//				isCorrectAnswer = true
				//				game.selectCellCounter[playerColor] = 2
				//
				//				selectCellMsg := h.event.SelectCellInfo(playerColor).Marshal()
				//				h.sendToAll(game.players, m.room, selectCellMsg)
				//				break
				//			}
				//		}
				//		game.answers = make(map[string]string, 0)
				//		game.questionCounter++
				//
				//		if !isCorrectAnswer {
				//			// отправка вопроса
				//			questionInfo = domain.GlobalFirstQuestions[game.questionCounter]
				//			msg = h.event.FirstQuestionInfo(questionInfo.Question).Marshal()
				//			h.sendToAll(game.players, m.room, msg)
				//			game.roundCounter++
				//		}
				//	}
				//}
			case domain.EventReceivedGetMapCell:
				count, found := game.selectCellCounter[m.playerColor]
				if found {
					count--
					game.selectCellCounter[m.playerColor] = count
					domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = m.playerColor

					game.freeCellCounter--
					mapMsg := h.event.MapInfo().Marshal()
					h.sendToAll(game.players, m.room, mapMsg)
					var isAllowAttack bool
					if game.freeCellCounter == 0 {
						isAllowAttack = true
						// отправляем сообщение о смене этапа игры
						allowAttackMsg := h.event.MapAllowAttackInfo().Marshal()
						h.sendToAll(game.players, m.room, allowAttackMsg)
					}

					if !isAllowAttack && count == 0 {
						delete(game.selectCellCounter, m.playerColor)
						// отправка вопроса
						questionInfo := domain.GlobalFirstQuestions[game.questionCounter]
						msg = h.event.FirstQuestionInfo(questionInfo.Question).Marshal()
						h.sendToAll(game.players, m.room, msg)
					}
				}
			case domain.EventMapAttack:
				// TODO отправлять вопрос и запоминнать клетку и хранить этап игры
				domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = m.playerColor
				mapMsg := h.event.MapInfo().Marshal()
				h.sendToAll(game.players, m.room, mapMsg)
			}
		case s := <-h.unregister:
			game, found := h.games[s.room]
			if found {
				colors := []string{s.player.Color}
				colors = append(colors, game.colors...)
				game.colors = colors

				delete(game.players, s.conn)
				close(s.conn.Send)
				if len(game.players) == 0 {
					delete(h.games, s.room)
				}
			}
		}
	}
}

// createOrGetGame создаёт или получает игру
func (h *hub) createOrGetGame(s *subscription) *gameStore {
	game, found := h.games[s.room]
	if !found {
		game = &gameStore{
			state:             1,
			questionCounter:   0,
			answerCounter:     0,
			roundCounter:      0,
			freeCellCounter:   4,
			selectCellCounter: make(map[string]int, 0),
			players:           nil,
			answers:           make(map[string]string, 0),
			secondAnswers:     []*domain.PlayerOption{},
			colors:            nil,
		}

		colors := []string{"player-1", "player-2", "player-3"}
		rand.Seed(time.Now().Unix())
		rand.Shuffle(len(colors), func(i, j int) {
			colors[i], colors[j] = colors[j], colors[i]
		})
		game.colors = colors

		s.player.Color = game.colors[0]
		game.colors = game.colors[1:]
		players := make(map[*domain.Connection]*domain.Player, 0)
		players[s.conn] = s.player
		game.players = players

		h.games[s.room] = game
	} else {
		s.player.Color = game.colors[0]
		game.colors = game.colors[1:]
		game.players[s.conn] = s.player
	}

	return game
}

// sendToAll отправляет всем
func (h *hub) sendToAll(players map[*domain.Connection]*domain.Player, room string, msg []byte) {
	for c := range players {
		h.sendToOne(players, c, room, msg)
	}
}

// sendToAll отправляет одному
func (h *hub) sendToOne(players map[*domain.Connection]*domain.Player, c *domain.Connection, room string, msg []byte) {
	select {
	case c.Send <- msg:
	default:
		close(c.Send)
		delete(players, c)
		if len(players) == 0 {
			delete(h.games, room)
		}
	}
}
