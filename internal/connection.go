package internal

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"quiz/internal/domain"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

// connection is an middleman between the websocket connection and the hub.
type connection struct {
	// соединение сокета
	ws *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte
}

// NewConnection конструктор соединения
func NewConnection(ws *websocket.Conn) *connection {
	return &connection{
		send: make(chan []byte, 256),
		ws:   ws,
	}
}

// ServeWs обработка подключения к сокету
func ServeWs(w http.ResponseWriter, r *http.Request, playerName string, roomId string) {
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	// проверка исходного запроса
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err.Error())
		return
	}
	fmt.Printf("Server got a new connection player: %s room: %s\n", playerName, roomId)
	p := domain.NewPlayer(playerName)
	c := NewConnection(ws)
	s := subscription{c, roomId, p}
	H.register <- s
	go s.writePump()
	go s.readPump()
}

// writePump отправляет сообщения в сокет и пингует его
func (s *subscription) writePump() {
	c := s.conn
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			// Отправка сообщения
			if err := c.write(websocket.TextMessage, message); err != nil {
				return
			}
			fmt.Println("Server sent a message: " + string(message))
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// write writes a message with the given message type and payload.
func (c *connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// readPump читает сообщения и отправляет событие отключения от сокета
func (s subscription) readPump() {
	c := s.conn
	defer func() {
		H.unregister <- s
		c.ws.Close()
	}()
	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, msg, err := c.ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}
		var request request
		// Json decode
		if err := json.Unmarshal(msg, &request); err != nil {
			log.Printf("Failed to decode json: %v", err)
		} else {
			if request.Type == 1 || request.Type == 2 {
				fmt.Println("Server received a message: " + string(msg) + " player: " + s.player.Name + " room: " + s.room)
				m := message{
					msg, s.room, &request,
				}
				H.broadcast <- m
			} else {
				log.Printf("Request of unknown type: %d", request.Type)
			}
		}
	}
}

// Type 1 - ответ на вопрос
// Type 2 - запрос следующего вопроса
type request struct {
	Type   int     `json:"type"`
	Option *string `json:"option,omitempty"`
}
