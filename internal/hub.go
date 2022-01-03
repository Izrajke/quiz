package internal

import (
	"encoding/json"
	"github.com/google/uuid"
	"quiz/internal/domain"
)

type message struct {
	data    []byte
	room    string
	request *request
}

type subscription struct {
	conn *connection
	room string
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// Registered connections.
	rooms map[string]map[*connection]bool

	// Inbound messages from the connections.
	broadcast chan message

	// Register requests from the connections.
	register chan subscription

	// Unregister requests from connections.
	unregister chan subscription
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

const (
	GameStateSendFirstQuestion = 1
	GameStateWaitAnswers       = 2
)

var H = hub{
	broadcast:  make(chan message),
	register:   make(chan subscription),
	unregister: make(chan subscription),
	rooms:      make(map[string]map[*connection]bool),
}

const (
	maxConnections = 2
)

// Хранилище для игр
var games = map[string]*game{}

func (h *hub) Run() {
	for {
		select {
		case s := <-h.register:
			connections := h.rooms[s.room]
			if connections == nil {
				connections = make(map[*connection]bool)
				h.rooms[s.room] = connections
			}
			h.rooms[s.room][s.conn] = true
			// Создание игры
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
				game.Players = append(game.Players, &domain.Player{
					Id:     uuid.New().String(),
					Name:   "Аноним 1",
					Points: 500,
				})

				// TODO refactoring
				playersMessage := &domain.PlayersMessage{
					Type:    12,
					Players: game.Players,
				}

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

			} else {
				cons := make([]*connection, 0, len(connections))
				for c := range connections {
					cons = append(cons, c)
				}
				currentGame.connections = cons
				currentGame.Players = append(currentGame.Players, &domain.Player{
					Id:     uuid.New().String(),
					Name:   "Аноним 2",
					Points: 1000,
				})

				// TODO refactoring
				playersMessage := &domain.PlayersMessage{
					Type:    12,
					Players: currentGame.Players,
				}

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
			}

			// Запуск игры
			if len(connections) == maxConnections {
				currentGame.state = GameStateWaitAnswers

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
