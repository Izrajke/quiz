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
	Avatar    string `json:"avatar"`
	CreatedAt int64
}

// newPlayer конструктор игрока
func newPlayer(name string, avatar string) *player {
	return &player{
		Id:        uuid.New().String(),
		Name:      name,
		Points:    defaultPoints,
		Avatar:    avatar,
		CreatedAt: time.Now().UnixNano(),
	}
}
