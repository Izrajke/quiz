package game

import (
	"github.com/google/uuid"
	"time"
)

const (
	defaultPoints = 300
)

// TODO переделать из .env
var Environment string

// мок uuid для тестов
var testIds = []string{
	"123e4567-e89b-12d3-a456-426614174001",
	"123e4567-e89b-12d3-a456-426614174002",
	"123e4567-e89b-12d3-a456-426614174003",
	"123e4567-e89b-12d3-a456-426614174004",
}
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

// NewPlayer конструктор игрока
func NewPlayer(name string) *Player {
	var id string
	if Environment != "test" {
		id = uuid.New().String()
	} else {
		id = testIds[0]
		testIds = testIds[1:]
	}
	createdAt := time.Now().UnixNano()

	return &Player{
		Id:        id,
		Name:      name,
		Points:    defaultPoints,
		CreatedAt: createdAt,
	}
}
