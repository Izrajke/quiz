package domain

import (
	"github.com/google/uuid"
	"math/rand"
)

const (
	defaultPoints = 300
)

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Points int    `json:"points"`
	Color  string `json:"color"`
}

// NewPlayer конструктор игрока
func NewPlayer(name string) *Player {
	// определение случайного цвета
	colors := []string{
		"player-1",
		"player-2",
		"player-3",
	}
	n := rand.Int() % len(colors)

	return &Player{
		Id:     uuid.New().String(),
		Name:   name,
		Points: defaultPoints,
		Color:  colors[n],
	}
}

type PlayersMessage struct {
	Type    int       `json:"type"`
	Players []*Player `json:"players"`
}
