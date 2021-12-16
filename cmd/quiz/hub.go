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
	round       int
	answers     int
	connections []*connection
}

var h = hub{
	broadcast:  make(chan message),
	register:   make(chan subscription),
	unregister: make(chan subscription),
	rooms:      make(map[string]map[*connection]bool),
	gameCh:     make(chan *game),
}

const maxConnections = 2

// Хранилка для игры
var globalGame = &game{}

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
			// Запуск игры
			if len(connections) == maxConnections {
				cons := make([]*connection, 0, len(connections))
				for c := range connections {
					cons = append(cons, c)
				}
				globalGame.round = 1
				globalGame.connections = cons
				h.gameCh <- globalGame
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
			globalGame.answers++
			if globalGame.answers == maxConnections {
				globalGame.answers = 0
				globalGame.round++
				h.gameCh <- globalGame
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
