package internal

import (
	"quiz/internal/domain"
)

type message struct {
	data    []byte
	room    string
	request *request
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

	// игроки, соединение - игрок
	players map[*domain.Connection]*domain.Player
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
	// TODO
	// 1. Сделать не повторяющиеся цвета
	// 2. Покрыть первичными тестами main.go
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
			// Получение ответа на вопрос
			case domain.EventReceivedAnswer:
				game.answerCounter++
				if len(game.players) == maxConnections {
					game.answerCounter = 0

					if game.roundCounter == 4 {
						msg = h.event.FinishInfo().Marshal()
					} else {
						questionInfo := domain.GlobalQuestions[game.questionCounter]
						msg = h.event.AnswerFirstQuestionInfo(questionInfo.Answer.Value).Marshal()
					}
				}
			// Запрос следующуего вопроса
			case domain.EventReceivedNextFirstQuestion:
				questionInfo := domain.GlobalQuestions[game.questionCounter]
				msg = h.event.FirstQuestionInfo(questionInfo.Question).Marshal()
				game.roundCounter++
			case domain.EventReceivedGetMapCell:
				domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = "player-2"
				msg = h.event.MapInfo().Marshal()
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
			state:   1,
			players: players,
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
