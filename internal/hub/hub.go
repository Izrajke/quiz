package hub

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4/pgxpool"
	"go.uber.org/zap"
	"quiz/internal/workerpool"
	"time"
)

// Hub хаб
type Hub struct {
	ctx  context.Context
	pool *pgxpool.Pool

	homeBroadcast  chan *HomeMessage
	homeRegister   chan *HomeClient
	homeUnregister chan *HomeClient
	homeClients    map[*HomeClient]time.Time

	// регистрируемые соединения
	GameRegister chan *Subscription
	// полученные сообщения
	GameBroadcast chan *Message
	// отключённые соединения
	GameUnregister chan Subscription

	// New logic //

	homeController *homeController // контроллер главной страницы
	gameController *gameController // контроллер игр

	logger *zap.Logger // логгер
}

func NewHub(
	ctx context.Context,
	gameStorage *GameStorage,
	pool *pgxpool.Pool,
	workerPool *workerpool.Pool,
	logger *zap.Logger,
) *Hub {
	eventBuilder := NewBuilder()
	eventSender := NewSender()

	return &Hub{
		ctx:  ctx,
		pool: pool,

		homeBroadcast:  make(chan *HomeMessage),
		homeRegister:   make(chan *HomeClient),
		homeUnregister: make(chan *HomeClient),
		homeClients:    make(map[*HomeClient]time.Time),

		GameRegister:   make(chan *Subscription),
		GameBroadcast:  make(chan *Message),
		GameUnregister: make(chan Subscription),

		homeController: newHomeController(eventBuilder, eventSender, gameStorage),
		gameController: newGameController(eventBuilder, eventSender, gameStorage, workerPool),
		logger:         logger.With(zap.String("channel", "hub")),
	}
}

// Game обработчик игр
func (h *Hub) Game() {
	defer func() {
		if msg := recover(); msg != nil {
			h.logger.Error("game recovered from panic", zap.Error(fmt.Errorf("%s", msg)))
		}
	}()

Loop:
	for {
		select {
		case subscription := <-h.GameRegister:
			h.gameController.Register(subscription, h.homeClients)
		case message := <-h.GameBroadcast:
			h.gameController.Broadcast(message)
		case s := <-h.GameUnregister:
			h.gameController.Unregister(s)
		case <-h.ctx.Done():
			break Loop
		}
	}
}

// Home обработчик главной страницы
func (h *Hub) Home() {
	defer func() {
		if msg := recover(); msg != nil {
			h.logger.Error("home recovered from panic", zap.Error(fmt.Errorf("%s", msg)))
		}
	}()

Loop:
	for {
		select {
		case client := <-h.homeRegister:
			h.homeController.register(client)
		case message := <-h.homeBroadcast:
			h.homeController.broadcast(message)
		case client := <-h.homeUnregister:
			h.homeController.unregister(client)
		case <-h.ctx.Done():
			break Loop
		}
	}
}
