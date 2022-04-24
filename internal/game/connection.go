package game

import (
	"fmt"
	"github.com/fasthttp/websocket"
	"github.com/valyala/fasthttp"
	"log"
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
func NewConnection(conn *websocket.Conn) *Connection {
	return &Connection{
		Send: make(chan []byte, 256),
		Ws:   conn,
	}
}

// ServeWs обработка подключения к сокету
func ServeWs(ctx *fasthttp.RequestCtx, hub *Hub, playerName string, roomId string) {
	var upgrader = websocket.FastHTTPUpgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	// проверка исходного запроса
	upgrader.CheckOrigin = func(ctx *fasthttp.RequestCtx) bool { return true }
	err := upgrader.Upgrade(ctx, func(conn *websocket.Conn) {
		fmt.Printf("Server got a new connection player: %s room: %s\n", playerName, roomId)
		p := NewPlayer(playerName)
		c := NewConnection(conn)
		s := Subscription{Conn: c, Room: roomId, Player: p}
		hub.Register <- s
		go s.WritePump()
		s.ReadPump(hub)
	})
	if err != nil {
		// TODO logger
		log.Println(err.Error())
		return
	}
}
