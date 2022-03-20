package game

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

const (
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

type Subscription struct {
	Conn   *Connection
	Room   string
	Player *Player
}

// WritePump отправляет сообщения в сокет и пингует его
func (s *Subscription) WritePump() {
	c := s.Conn
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.Write(websocket.CloseMessage, []byte{})
				return
			}
			// Отправка сообщения
			if err := c.Write(websocket.TextMessage, message); err != nil {
				return
			}
			fmt.Println("Server sent a message: " + string(message))
		case <-ticker.C:
			if err := c.Write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// ReadPump читает сообщения и отправляет событие отключения от сокета
func (s Subscription) ReadPump(hub *Hub) {
	c := s.Conn
	defer func() {
		hub.Unregister <- s
		c.Ws.Close()
	}()
	c.Ws.SetReadLimit(maxMessageSize)
	c.Ws.SetReadDeadline(time.Now().Add(pongWait))
	c.Ws.SetPongHandler(func(string) error { c.Ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, msg, err := c.Ws.ReadMessage()
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
			if request.Type == 1 || request.Type == 3 {
				fmt.Println("Server received a message: " + string(msg) + " player: " + s.Player.Name + " room: " + s.Room)

				m := Message{
					data:        msg,
					Room:        s.Room,
					PlayerColor: s.Player.Color,
					Request:     &request,
					Time:        time.Now(),
				}
				hub.Broadcast <- m
			} else {
				log.Printf("Request of unknown type: %d", request.Type)
			}
		}
	}
}

type Message struct {
	data []byte
	Room string
	// TODO may change for player id
	PlayerColor string
	Request     *request
	Time        time.Time
}

// Type 1 - ответ на вопрос
// Type 3 - получение или атака клетки
type request struct {
	Type      int    `json:"type"`
	Option    string `json:"option,omitempty"`
	RowIndex  int    `json:"rowIndex,omitempty"`
	CellIndex int    `json:"cellIndex,omitempty"`
}
