package domain

import "github.com/google/uuid"

const (
	defaultPoints = 300
)

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Points int    `json:"points"`
}

// NewPlayer конструктор игрока
func NewPlayer(name string) *Player {
	return &Player{
		Id:     uuid.New().String(),
		Name:   name,
		Points: defaultPoints,
	}
}

type PlayersMessage struct {
	Type    int       `json:"type"`
	Players []*Player `json:"players"`
}
