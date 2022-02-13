package domain

import (
	"github.com/gorilla/websocket"
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
