package game

import (
	"encoding/json"
	"github.com/fasthttp/websocket"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
	"log"
	"strings"
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
func ServeWs(
	ctx *fasthttp.RequestCtx,
	hub *Hub,
	logger *zap.Logger,
	playerName string,
	roomId string,
	avatar string,
) {
	var upgrader = websocket.FastHTTPUpgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	// проверка исходного запроса
	upgrader.CheckOrigin = func(ctx *fasthttp.RequestCtx) bool { return true }
	err := upgrader.Upgrade(ctx, func(conn *websocket.Conn) {
		if roomId != "" {
			logger.Info(
				"server got a new connection for game",
				zap.String("playerName", playerName),
				zap.String("roomID", roomId),
				zap.String("avatar", avatar),
			)
			p := newPlayer(playerName, avatar)
			c := NewConnection(conn)
			s := Subscription{Conn: c, Room: roomId, Player: p, logger: logger}
			hub.Register <- s
			go s.WritePump()
			s.ReadPump(hub)
		} else {
			logger.Info("server got a new connection for home", zap.String("playerName", playerName))
			client := &HomeClient{conn: conn, send: make(chan []byte, 256)}
			hub.homeRegister <- client
			go client.writePump()
			client.readPump(hub, logger)
		}
	})
	if err != nil {
		logger.Error("failed to connect websocket", zap.Error(err))
	}
}

// TODO refactoring
var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *HomeClient) readPump(hub *Hub, logger *zap.Logger) {
	defer func() {
		hub.homeRegister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		var request homeRequest
		// Json decode
		if err := json.Unmarshal(message, &request); err != nil {
			logger.Error("failed to decode json after read message", zap.Error(err))
		} else {
			if request.Type == 10 {
				logger.Info(
					"server received a message",
					zap.String("message", string(message)),
				)

				request.Message = strings.ReplaceAll(request.Message, `\n`, " ")
				hub.homeBroadcast <- []byte(request.Message)
			} else {
				logger.Error("request of unknown type", zap.Int("type", request.Type))
			}
		}
	}
}

// Type 10 - сообщение чата
type homeRequest struct {
	Type    int    `json:"type"`
	Message string `json:"message"`
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *HomeClient) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
