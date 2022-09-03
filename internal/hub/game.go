package hub

import (
	"quiz/internal/http/api"
	"time"
)

const (
	player1Color         = "player-1"
	player2Color         = "player-2"
	player3Color         = "player-3"
	playerUndefinedColor = "player-undefined"
)

type PlayerAnswer struct {
	Color string  `json:"color"` // TODO
	Name  string  `json:"name"`  // TODO
	Value int     `json:"value"`
	Time  float64 `json:"time"`
}

type Settings struct {
	packageID   int
	Name        string
	password    string
	PlayerCount int
}

type TakeCell struct {
	Count int
	Color string
}

type Game struct {
	Settings        *Settings                // настройки
	Players         map[*Connection]*Player  // список игроков
	playerColors    map[string]struct{}      // список с цветами игроков
	PlayersAnswers  map[string]*PlayerAnswer // ответы игроков на вопросы
	FullPackage     *api.FullPack            // сборник вопросов
	PlayersTakeCell []*TakeCell              // информация о захвате клеток игроками

	RowIndex  int
	CellIndex int

	moves []string
	State *GameState // состояние игры
	Map   *GameMap   // игровое поле

	// счетчики
	round          int // номер раунда
	rangeQuestion  int // номер вопроса с диапазоном
	choiceQuestion int // номер вопроса с выбором

	// время
	questionStartedAt time.Time // время отправки вопроса
}

func NewGame(packageID int, name string, password string, playerCount int, fullPackage *api.FullPack) *Game {
	var playerColors = []string{player1Color, player2Color, player3Color}
	colors := make(map[string]struct{}, playerCount)
	for i := 0; i < playerCount; i++ {
		colors[playerColors[i]] = struct{}{}
	}

	return &Game{
		Settings: &Settings{
			packageID:   packageID,
			Name:        name,
			password:    password,
			PlayerCount: playerCount,
		},
		Players:           make(map[*Connection]*Player),
		playerColors:      colors,
		PlayersAnswers:    make(map[string]*PlayerAnswer),
		FullPackage:       fullPackage,
		PlayersTakeCell:   make([]*TakeCell, 0),
		RowIndex:          0,
		CellIndex:         0,
		moves:             make([]string, 0),
		State:             NewGameState(),
		Map:               NewGameMap(),
		round:             0,
		rangeQuestion:     0,
		choiceQuestion:    0,
		questionStartedAt: time.Time{},
	}
}

// Start старт игры
func (g *Game) Start() {
	g.rangeQuestion++
	g.SetQuestionStartedAt()
}

func (g *Game) AddPlayer(connection *Connection, player *Player) {
	playerColor := playerUndefinedColor
	for color := range g.playerColors {
		delete(g.playerColors, color)
		playerColor = color
		break
	}
	player.Color = playerColor
	g.Players[connection] = player
}

func (g *Game) PlayerCount() int {
	return len(g.Players)
}

func (g *Game) IsFullPlayers() bool {
	return g.PlayerCount() == g.Settings.PlayerCount
}

// SetQuestionStartedAt запоминаем время отправки вопроса
func (g *Game) SetQuestionStartedAt() {
	g.questionStartedAt = time.Now()
}

func (g *Game) SetMoves(moves []string) {
	g.moves = moves
}

func (g *Game) IncRound() {
	g.round++
}

func (g *Game) GetRound() int {
	return g.round + 1
}

func (g *Game) ResetRound() {
	g.round = 0
}
