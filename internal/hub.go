package internal

import (
	"quiz/internal/domain"
)

type message struct {
	data []byte
	room string
	// TODO may change for player id
	playerColor string
	request     *request
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

	// игроки, соединение - игрок
	players map[*domain.Connection]*domain.Player

	// ответы игроков
	answers map[string]string
}

func NewHub() *hub {
	return &hub{
		register:   make(chan subscription),
		broadcast:  make(chan message),
		unregister: make(chan subscription),
		// игры
		games: make(map[string]*gameStore),
		// события
		event: domain.NewEvent(),
	}
}

const (
	// максимальное кол-во игроков
	maxConnections = 2
)

func (h *hub) Run() {
	for {
		select {
		// зарегистрировано новое соединение
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
				if len(domain.GlobalQuestions) == game.questionCounter {
					// TODO временное решение
					game.questionCounter = 0
				}
				questionInfo := domain.GlobalQuestions[game.questionCounter]
				// 4. отправка вопроса
				msg = h.event.FirstQuestionInfo(questionInfo.Question).Marshal()
				h.sendToAll(game.players, s.room, msg)
			}
		case m := <-h.broadcast:
			game := h.games[m.room]

			var msg []byte
			switch m.request.Type {
			// получение ответа на вопрос
			case domain.EventReceivedAnswer:
				game.answerCounter++

				// сохранение ответа игрока
				game.answers[m.playerColor] = m.request.Option
				// ожидание всех ответов
				if len(game.players) == game.answerCounter {
					game.answerCounter = 0

					if game.roundCounter == 4 {
						msg = h.event.FinishInfo().Marshal()
					} else {
						questionInfo := domain.GlobalQuestions[game.questionCounter]
						correctAnswer := questionInfo.Answer.Value
						answerMsg := h.event.AnswerFirstQuestionInfo(correctAnswer).Marshal()
						h.sendToAll(game.players, m.room, answerMsg)

						for playerColor, answer := range game.answers {
							if answer == correctAnswer {
								selectCellMsg := h.event.SelectCellInfo(playerColor).Marshal()
								h.sendToAll(game.players, m.room, selectCellMsg)
								break
							}
						}
						game.answers = make(map[string]string, 0)
					}
				}
			// запрос следующуего вопроса
			case domain.EventReceivedNextFirstQuestion:
				questionInfo := domain.GlobalQuestions[game.questionCounter]
				msg = h.event.FirstQuestionInfo(questionInfo.Question).Marshal()
				game.roundCounter++
			case domain.EventReceivedGetMapCell:
				domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = m.playerColor
				game.freeCellCounter--
				mapMsg := h.event.MapInfo().Marshal()
				h.sendToAll(game.players, m.room, mapMsg)
				if game.freeCellCounter == 0 {
					allowAttackMsg := h.event.MapAllowAttackInfo().Marshal()
					h.sendToAll(game.players, m.room, allowAttackMsg)
				}
			case domain.EventMapAttack:
				// TODO отправлять вопрос
				domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = m.playerColor
				mapMsg := h.event.MapInfo().Marshal()
				h.sendToAll(game.players, m.room, mapMsg)
			}

			if msg != nil {
				h.sendToAll(game.players, m.room, msg)
			}
		case s := <-h.unregister:
			game, found := h.games[s.room]
			if found {
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
		players := make(map[*domain.Connection]*domain.Player, 0)
		players[s.conn] = s.player

		game = &gameStore{
			state:           1,
			questionCounter: 0,
			answerCounter:   0,
			roundCounter:    0,
			freeCellCounter: 4,
			players:         players,
			answers:         make(map[string]string, 0),
		}
		h.games[s.room] = game
	} else {
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
