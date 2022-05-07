package game

import (
	"math/rand"
	"time"
)

type PlayerOption struct {
	Color string  `json:"color"`
	Name  string  `json:"name"`
	Value int     `json:"value"`
	Time  float64 `json:"time"`
}

type Game struct {
	// максимальное кол-во игроков в игре
	maxPlayers int
	// данные о игроках, соединение - игрок
	Players map[*Connection]*player
	// счетчик раундов
	RoundCount int
	// счетчик вопросов первого типа
	FirstQuestionCount int
	// счетчик вопросов второго типа
	SecondQuestionCount int
	// счетчик ответов
	AnswerCount int

	// ответы игроков на первый тип вопроса
	FirstAnswers map[string]string
	// ответы игроков на второй тип вопроса
	SecondAnswers []*PlayerOption
	// время, когда отправили вопрос второго типа
	SecondQuestionStartedAt time.Time
	// доступное кол-во для выбора клеток
	SelectCellCount map[string]int
	// порядок ходов игроков для нападения
	PlayerMoves []string
	// доступные цвета для игроков
	Colors []string
	// флаг начала этапа нападения
	IsAttack bool

	// кол-во свободных клеток на карте
	FreeCellCounter int
}

// CreateOrGetGame создаёт или получает игру
func CreateOrGetGame(games map[string]*Game, s *Subscription) *Game {
	game, found := games[s.Room]
	if !found {
		game = &Game{
			maxPlayers:              2,
			Players:                 nil,
			RoundCount:              1,
			FirstQuestionCount:      0,
			SecondQuestionCount:     0,
			AnswerCount:             0,
			FirstAnswers:            make(map[string]string, 0),
			SecondAnswers:           make([]*PlayerOption, 0),
			SecondQuestionStartedAt: time.Time{},
			SelectCellCount:         make(map[string]int, 0),
			PlayerMoves:             make([]string, 0),
			Colors:                  nil,
			IsAttack:                false,
			FreeCellCounter:         3,
		}

		colors := []string{"player-1", "player-2", "player-3"}
		rand.Seed(time.Now().Unix())
		rand.Shuffle(len(colors), func(i, j int) {
			colors[i], colors[j] = colors[j], colors[i]
		})
		game.Colors = colors

		s.Player.Color = game.Colors[0]
		game.Colors = game.Colors[1:]
		players := make(map[*Connection]*player, 0)
		players[s.Conn] = s.Player
		game.Players = players

		games[s.Room] = game
	} else {
		s.Player.Color = game.Colors[0]
		game.Colors = game.Colors[1:]
		game.Players[s.Conn] = s.Player
	}

	return game
}

func (g *Game) LenPlayers() int {
	return len(g.Players)
}

func (g *Game) IsFullPlayers() bool {
	return g.LenPlayers() == g.maxPlayers
}

func (g *Game) IsEveryoneAnswered() bool {
	return g.LenPlayers() == g.AnswerCount
}
