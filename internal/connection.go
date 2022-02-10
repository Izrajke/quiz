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
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

// ServeWs обработка подключения к сокету
func ServeWs(w http.ResponseWriter, r *http.Request, hub *hub, playerName string, roomId string) {
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
	c := domain.NewConnection(ws)
	s := subscription{c, roomId, p}
	hub.register <- s
	go s.writePump()
	go s.readPump(hub)
}

// writePump отправляет сообщения в сокет и пингует его
func (s *subscription) writePump() {
	c := s.conn
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

// readPump читает сообщения и отправляет событие отключения от сокета
func (s subscription) readPump(hub *hub) {
	c := s.conn
	defer func() {
		hub.unregister <- s
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
			if request.Type == 1 || request.Type == 2 || request.Type == 3 {
				fmt.Println("Server received a message: " + string(msg) + " player: " + s.player.Name + " room: " + s.room)
				m := message{
					msg, s.room, &request,
				}
				hub.broadcast <- m
			} else {
				log.Printf("Request of unknown type: %d", request.Type)
			}
		}
	}
}

// Type 1 - ответ на вопрос
// Type 2 - запрос следующего вопроса
// Type 3 - получение территории
type request struct {
	Type      int    `json:"type"`
	Option    string `json:"option,omitempty"`
	RowIndex  int    `json:"rowIndex,omitempty"`
	CellIndex int    `json:"cellIndex,omitempty"`
}
