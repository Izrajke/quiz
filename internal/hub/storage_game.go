package hub

import (
	"sync"
)

type GameStorage struct {
	mu    sync.RWMutex
	games map[string]*Game
}

func NewGameStorage() *GameStorage {
	return &GameStorage{
		mu:    sync.RWMutex{},
		games: make(map[string]*Game),
	}
}

func (g *GameStorage) Set(gameID string, game *Game) {
	g.mu.Lock()
	defer g.mu.Unlock()
	g.games[gameID] = game
}

func (g *GameStorage) Delete(gameID string) {
	g.mu.Lock()
	defer g.mu.Unlock()
	delete(g.games, gameID)
}

func (g *GameStorage) Get(gameID string) (*Game, bool) {
	g.mu.RLock()
	defer g.mu.RUnlock()
	val, ok := g.games[gameID]
	return val, ok
}

func (g *GameStorage) GetAll() map[string]*Game {
	g.mu.RLock()
	defer g.mu.RUnlock()
	return g.games
}
