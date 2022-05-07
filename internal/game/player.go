package game

import (
	"github.com/google/uuid"
	"time"
)

const (
	defaultPoints = 300
)

type player struct {
	Id        string `json:"id"`
	Name      string `json:"name"`
	Points    int    `json:"points"`
	Color     string `json:"color"`
	CreatedAt int64
}

// newPlayer конструктор игрока
func newPlayer(name string) *player {
	return &player{
		Id:        uuid.New().String(),
		Name:      name,
		Points:    defaultPoints,
		CreatedAt: time.Now().UnixNano(),
	}
}
