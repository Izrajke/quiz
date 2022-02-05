package internal

import (
	"encoding/json"
	"quiz/internal/domain"
)

type message struct {
	data    []byte
	room    string
	request *request
}

type subscription struct {
	conn   *connection
	room   string
	player *domain.Player
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// Inbound messages from the connections.
	broadcast chan message

	// Register requests from the connections.
	register chan subscription

	// Unregister requests from connections.
	unregister chan subscription

	// Комнаты
	rooms map[string]map[*connection]bool
}

type game struct {
	connections []*connection
	state       int
	round       int

	answers int

	firstQuestionCounter  int
	secondQuestionCounter int

	Players []*domain.Player
}

// Хранилище для игр
var games = map[string]*game{}

const (
	GameStateSendFirstQuestion = 1
	GameStateWaitAnswers       = 2
)

func NewHub() *hub {
	return &hub{
		broadcast:  make(chan message),
		register:   make(chan subscription),
		unregister: make(chan subscription),
		rooms:      make(map[string]map[*connection]bool),
	}
}

const (
	maxConnections = 2
)

func (h *hub) Run() {
	for {
		select {
		// подключилось новое соединение
		case s := <-h.register:
			connections := h.rooms[s.room]
			if connections == nil {
				connections = make(map[*connection]bool)
				h.rooms[s.room] = connections
			}
			h.rooms[s.room][s.conn] = true

			// Создание игры
			// TODO создавать игру раньше
			currentGame, found := games[s.room]
			if !found {
				cons := make([]*connection, 0, len(connections))
				for c := range connections {
					cons = append(cons, c)
				}
				game := &game{
					connections: cons,
					round:       1,
				}
				games[s.room] = game
				game.Players = append(game.Players, s.player)

				// TODO refactoring
				playersMessage := &domain.PlayersMessage{
					Type:    12,
					Players: game.Players,
				}

				// 1. Инициализация игроков
				event, _ := json.Marshal(playersMessage)
				for c := range connections {
					select {
					case c.send <- event:
					default:
						close(c.send)
						delete(connections, c)
						if len(connections) == 0 {
							delete(h.rooms, s.room)
						}
					}
				}

				// 2. Инициализация карты
				map3, _ := json.Marshal(domain.MessageMap)
				s.conn.send <- map3

			} else {
				cons := make([]*connection, 0, len(connections))
				for c := range connections {
					cons = append(cons, c)
				}
				currentGame.connections = cons
				currentGame.Players = append(currentGame.Players, s.player)

				// TODO refactoring
				playersMessage := &domain.PlayersMessage{
					Type:    12,
					Players: currentGame.Players,
				}

				// 1. Инициализация игроков
				event, _ := json.Marshal(playersMessage)
				for c := range connections {
					select {
					case c.send <- event:
					default:
						close(c.send)
						delete(connections, c)
						if len(connections) == 0 {
							delete(h.rooms, s.room)
						}
					}
				}

				// 2. Инициализация карты
				map3, _ := json.Marshal(domain.MessageMap)
				s.conn.send <- map3
			}

			// Запуск игры
			if len(connections) == maxConnections {
				currentGame.state = GameStateWaitAnswers
				// TODO refactoring
				// Из-за того, что увеличиваем счетчик при заходе, поэтому не правильно считаем номер первого вопроса
				if len(domain.Questions) == currentGame.firstQuestionCounter {
					currentGame.firstQuestionCounter = 0
				}
				question := domain.Questions[currentGame.firstQuestionCounter]
				question.Answer = nil
				currentGame.firstQuestionCounter++

				event, _ := json.Marshal(question)

				for c := range connections {
					select {
					case c.send <- event:
					default:
						close(c.send)
						delete(connections, c)
						if len(connections) == 0 {
							delete(h.rooms, s.room)
						}
					}
				}
			}
		case s := <-h.unregister:
			connections := h.rooms[s.room]
			if connections != nil {
				// TODO refactoring
				// Удаляем игрока после отключения
				game, found := games[s.room]
				if found {
					game.Players = game.Players[:len(game.Players)-1]
				}

				if _, ok := connections[s.conn]; ok {
					delete(connections, s.conn)
					close(s.conn.send)
					if len(connections) == 0 {
						delete(h.rooms, s.room)
					}
				}
			}
		case m := <-h.broadcast:
			connections := h.rooms[m.room]
			game := games[m.room]

			var event []byte
			switch m.request.Type {
			case 1:
				// Получение ответа на вопрос
				if game.state == GameStateWaitAnswers {
					game.answers++
					if game.answers == maxConnections {
						game.answers = 0

						if game.round == 4 {
							finish := &finish{Type: 999}
							event, _ = json.Marshal(finish)
						} else {
							question := domain.Questions[game.firstQuestionCounter]
							answer := &domain.FirstQuestionAnswer{
								Type:   5,
								Answer: domain.Answer{Value: question.Answer.Value},
							}
							event, _ = json.Marshal(answer)
							game.state = GameStateSendFirstQuestion
						}
					}
				}
			case 2:
				// Запрос следующуего вопроса
				if game.state == GameStateSendFirstQuestion {
					question := domain.Questions[game.firstQuestionCounter]
					question.Answer = nil
					event, _ = json.Marshal(question)

					game.firstQuestionCounter++
					game.state = GameStateWaitAnswers
					game.round++
				}
			case 3:
				domain.GlobalMap[m.request.RowIndex][m.request.CellIndex].Owner = "player-2"
				event, _ = json.Marshal(domain.MessageMap)
			}

			if event != nil {
				for c := range connections {
					select {
					case c.send <- event:
					default:
						close(c.send)
						delete(connections, c)
						if len(connections) == 0 {
							delete(h.rooms, m.room)
						}
					}
				}
			}
		}
	}
}

type finish struct {
	Type int `json:"type"`
}
