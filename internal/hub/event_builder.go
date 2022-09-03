package hub

import (
	"encoding/json"
	"fmt"
	"quiz/internal/http/api"
	"sort"
)

// BaseType идентификатор типа сообщения
type BaseType int

// Builder сборщик событий
type Builder struct {
}

func NewBuilder() *Builder {
	return &Builder{}
}

// TODO
type firstQuestion struct {
	Title   string            `json:"title"`
	Options map[string]string `json:"options"`
}

// переводит локальную структуру в массив байт
func (b *Builder) prepare(message interface{}) []byte {
	data, err := json.Marshal(message)
	if err != nil {
		fmt.Println("failed to marshal message")
	}
	return data
}

// InitWaitingGames инициализация ожидающих игр
func (b *Builder) InitWaitingGames(games map[string]*Game) []byte {
	type waitingGame struct {
		ID      string   `json:"id"`
		Pack    string   `json:"pack"`
		Subject string   `json:"subject"`
		Players []string `json:"players"`
		Max     int      `json:"max"`
	}
	waitingGames := make([]*waitingGame, 0)
	for id, game := range games {
		if !game.IsFullPlayers() {
			players := make([]string, 0)
			for _, gamePlayer := range game.Players {
				players = append(players, gamePlayer.Name)
			}
			waitingGames = append(waitingGames, &waitingGame{
				ID:      id,
				Pack:    game.Settings.Name,
				Subject: game.FullPackage.Title,
				Players: players,
				Max:     game.Settings.PlayerCount,
			})
		}
	}

	return b.prepare(struct {
		BaseType    `json:"type"`
		WaitingGame []*waitingGame `json:"rooms"`
	}{
		BaseType:    initWaitingGames,
		WaitingGame: waitingGames,
	})
}

// InitPlayers инициализация игроков
func (b *Builder) InitPlayers(players map[*Connection]*Player) []byte {
	playersSlice := make([]*Player, 0, len(players))
	for _, player := range players {
		playersSlice = append(playersSlice, player)
	}
	sort.SliceStable(playersSlice, func(i, j int) bool {
		return playersSlice[i].CreatedAt < playersSlice[j].CreatedAt
	})

	return b.prepare(struct {
		BaseType `json:"type"`
		Players  []*Player `json:"players"`
	}{
		BaseType: initPlayers,
		Players:  playersSlice,
	})
}

// InitMap инициализация карты
func (b *Builder) InitMap(gameMap [][]*Cell) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Map      [][]*Cell `json:"map"`
	}{
		BaseType: initMap,
		Map:      gameMap,
	})
}

// InitRound инициализация раунда
func (b *Builder) InitRound(round int) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Number   int `json:"number"`
	}{
		BaseType: initRound,
		Number:   round,
	})
}

// MovesToCapture ходы для захвата
func (b *Builder) MovesToCapture(turns int) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Turns    int `json:"turns"`
	}{
		BaseType: movesToCapture,
		Turns:    turns,
	})
}

func (b *Builder) ChoiceQuestion(multipleChoiceQuestion api.MultipleChoiceQuestion) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Question firstQuestion `json:"question"`
		Answer   *Answer       `json:"answer,omitempty"`
	}{
		BaseType: choiceQuestion,
		Question: firstQuestion{
			Title: multipleChoiceQuestion.Title,
			Options: map[string]string{
				"1": multipleChoiceQuestion.Options[0],
				"2": multipleChoiceQuestion.Options[1],
				"3": multipleChoiceQuestion.Options[2],
				"4": multipleChoiceQuestion.Options[3],
			},
		},
	})
}

func (b *Builder) RangeQuestion(rangeQuestionDb api.RangeQuestion) []byte {
	return b.prepare(struct {
		BaseType      `json:"type"`
		Question      SecondQuestion  `json:"question"`
		PlayerOptions []*PlayerOption `json:"options,omitempty"`
		Answer        *Answer         `json:"answer,omitempty"`
	}{
		BaseType: rangeQuestion,
		Question: SecondQuestion{
			Title: rangeQuestionDb.Title,
		},
	})
}

// TODO
type SecondQuestion struct {
	Title string `json:"title"`
}

type PlayerOption struct {
	Color string  `json:"color"`
	Name  string  `json:"name"`
	Value int     `json:"value"`
	Time  float64 `json:"time"`
}

type Answer struct {
	Value string `json:"value"`
}

// AnswerSecondQuestion ответ на вопрос второго типа
func (b *Builder) AnswerSecondQuestion(playersAnswers map[string]*PlayerAnswer, answerValue int) []byte {
	playersAnswersSlice := make([]*PlayerAnswer, 0)
	for _, playersAnswer := range playersAnswers {
		playersAnswersSlice = append(playersAnswersSlice, &PlayerAnswer{
			Color: playersAnswer.Color,
			Name:  playersAnswer.Name,
			Value: playersAnswer.Value,
			Time:  playersAnswer.Time,
		})
	}

	return b.prepare(struct {
		BaseType      `json:"type"`
		Question      SecondQuestion  `json:"question"`
		PlayerOptions []*PlayerAnswer `json:"options,omitempty"`
		Answer        *Answer         `json:"answer,omitempty"`
	}{
		BaseType:      eventAnswerSecondQuestionType,
		PlayerOptions: playersAnswersSlice,
		Answer:        &Answer{Value: fmt.Sprint(answerValue)},
	})
}

// SelectCell игрок получает клетки
func (b *Builder) SelectCell(color string, count int) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Color    string `json:"color"`
		Count    int    `json:"count"`
	}{
		BaseType: eventSelectCellType,
		Color:    color,
		Count:    count,
	})
}

// ChatMessage сообщение из чата
func (b *Builder) ChatMessage(message string, playerName string, time int64) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Message  string `json:"message"`
		Author   string `json:"author"`
		Time     int64  `json:"time"`
	}{
		BaseType: eventChatMessageType,
		Message:  message,
		Author:   playerName,
		Time:     time,
	})
}

// AnswerFirstQuestion ответ на вопрос первого типа
func (b *Builder) AnswerFirstQuestion(answerValue int) []byte {
	return b.prepare(struct {
		BaseType int           `json:"type"`
		Question firstQuestion `json:"question"`
		Answer   *Answer       `json:"answer,omitempty"`
	}{
		BaseType: eventAnswerFirstQuestionType,
		Answer:   &Answer{Value: fmt.Sprint(answerValue)},
	})
}

// NumberOfMovesForAttack ходы для стадии атаки
func (b *Builder) NumberOfMovesForAttack(turns []string) []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
		Turns    []string `json:"turns"`
	}{
		BaseType: movesToAttack,
		Turns:    turns,
	})
}

func (b *Builder) EndGame() []byte {
	return b.prepare(struct {
		BaseType `json:"type"`
	}{
		BaseType: endGame,
	})
}
