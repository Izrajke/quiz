package hub

import (
	"encoding/json"
	"github.com/fasthttp/websocket"
	"go.uber.org/zap"
	"strconv"
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

// TODO refactoring
type HomeClient struct {
	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	Send chan []byte
}

type HomeMessage struct {
	client *HomeClient

	message string
	author  string
}

type Subscription struct {
	Conn   *Connection
	GameID string
	Player *Player
	logger *zap.Logger
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
			c.Ws.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Ws.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// Отправка сообщения
			if err := c.Ws.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
			s.logger.Info("server sent a message", zap.String("message", string(message)))
		case <-ticker.C:
			if err := c.Ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}

// ReadPump читает сообщения и отправляет событие отключения от сокета
func (s Subscription) ReadPump(hub *Hub) {
	c := s.Conn
	defer func() {
		hub.GameUnregister <- s
		c.Ws.Close()
	}()
	c.Ws.SetReadLimit(maxMessageSize)
	c.Ws.SetReadDeadline(time.Now().Add(pongWait))
	c.Ws.SetPongHandler(func(string) error { c.Ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.Ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(
				err,
				websocket.CloseGoingAway,
			) {
				s.logger.Error("failed to read message", zap.Error(err))
			}
			break
		}
		var request request
		// Json decode
		if err := json.Unmarshal(message, &request); err != nil {
			s.logger.Error("failed to decode json after read message", zap.Error(err))
		} else {
			if request.Type == 1 || request.Type == 3 || request.Type == 4 {
				s.logger.Info(
					"server received a message",
					zap.String("message", string(message)),
					zap.String("playerName", s.Player.Name),
					zap.String("roomID", s.GameID),
				)

				answerInt, _ := strconv.Atoi(request.Answer) // refactoring it
				request.AnswerInt = answerInt
				m := &Message{
					data:        message,
					Room:        s.GameID,
					PlayerID:    s.Player.Id,
					PlayerColor: s.Player.Color,
					PlayerName:  s.Player.Name,
					Request:     &request,
					Time:        time.Now(),
				}
				hub.GameBroadcast <- m
			} else {
				s.logger.Error("request of unknown type", zap.Int("type", request.Type))
			}
		}
	}
}

type Message struct {
	data []byte
	Room string
	// TODO may change for player id
	PlayerID    string
	PlayerColor string
	PlayerName  string
	Request     *request
	Time        time.Time
}

// Type 1 - ответ на вопрос
// Type 3 - получение клетки
// Type 4 - атака клетки
type request struct {
	Type      int    `json:"type"`
	Answer    string `json:"option,omitempty"` // deprecated use AnswerInt
	AnswerInt int
	RowIndex  int `json:"rowIndex,omitempty"`
	CellIndex int `json:"cellIndex,omitempty"`
}
