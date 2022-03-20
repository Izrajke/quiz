package game

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
)

// Connection is an middleman between the websocket Connection and the hub.
type Connection struct {
	// соединение сокета
	Ws *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan []byte
}

// NewConnection конструктор соединения
func NewConnection(ws *websocket.Conn) *Connection {
	return &Connection{
		Send: make(chan []byte, 256),
		Ws:   ws,
	}
}

// Write writes a message with the given message type and payload.
func (c *Connection) Write(mt int, payload []byte) error {
	c.Ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.Ws.WriteMessage(mt, payload)
}

// ServeWs обработка подключения к сокету
func ServeWs(w http.ResponseWriter, r *http.Request, hub *Hub, playerName string, roomId string) {
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
	p := NewPlayer(playerName)
	c := NewConnection(ws)
	s := Subscription{Conn: c, Room: roomId, Player: p}
	hub.Register <- s
	go s.WritePump()
	go s.ReadPump(hub)
}
