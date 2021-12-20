package main

type message struct {
	data []byte
	room string
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

	gameCh chan *game
}

type game struct {
	connections []*connection
	state       int
	round       int

	answers int

	firstQuestionCounter  int
	secondQuestionCounter int
}

const (
	GameStateSendFirstQuestion = 1
	GameStateWaitAnswers       = 2
)

var h = hub{
	broadcast:  make(chan message),
	register:   make(chan subscription),
	unregister: make(chan subscription),
	rooms:      make(map[string]map[*connection]bool),
	gameCh:     make(chan *game),
}

const maxConnections = 2

// Хранилище для игр
var globalGame = map[string]*game{}

func (h *hub) run() {
	for {
		select {
		case s := <-h.register:
			connections := h.rooms[s.room]
			if connections == nil {
				connections = make(map[*connection]bool)
				h.rooms[s.room] = connections
			}
			h.rooms[s.room][s.conn] = true
			// Создание и запуск игры
			if len(connections) == maxConnections {
				cons := make([]*connection, 0, len(connections))
				for c := range connections {
					cons = append(cons, c)
				}
				game := &game{
					connections: cons,
					state:       GameStateSendFirstQuestion,
					round:       1,
				}

				globalGame[s.room] = game
				h.gameCh <- game
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
			// Считаем кол-во ответов и вызываем следующий вопрос
			game := globalGame[m.room]
			game.answers++
			if game.answers == maxConnections {
				game.answers = 0
				h.gameCh <- game
			}

			for c := range connections {
				select {
				case c.send <- m.data:
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
