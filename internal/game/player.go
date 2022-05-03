package game

import (
	"github.com/google/uuid"
	"time"
)

const (
	defaultPoints = 300
)

var colors = []string{
	"player-1",
	"player-2",
	"player-3",
}

type Player struct {
	Id        string `json:"id"`
	Name      string `json:"name"`
	Points    int    `json:"points"`
	Color     string `json:"color"`
	CreatedAt int64
}

// newPlayer конструктор игрока
func newPlayer(name string) *Player {
	return &Player{
		Id:        uuid.New().String(),
		Name:      name,
		Points:    defaultPoints,
		CreatedAt: time.Now().UnixNano(),
	}
}
