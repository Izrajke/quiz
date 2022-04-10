package game

import (
	"encoding/json"
	"sort"
)

const (
	// Клиентские типы

	// EventAnswerType ответ на вопрос
	EventAnswerType = 1
	// EventGetCellType получение клетки на карте
	EventGetCellType = 3
	// EventAttackCellType атака клетки на карте
	EventAttackCellType = 4

	// Серверные типы

	// вопрос первого типа
	eventFirstQuestion = 1
	// вопрос второго типа
	eventSecondQuestionType = 2
	// ответ на вопрос первого типа
	eventAnswerFirstQuestionType = 5
	// ответ на вопрос второго типа
	eventAnswerSecondQuestionType = 6
	// информация о получении клетки
	eventSelectCellType = 7
	// кол-во ходов для стадии захвата
	eventNumberOfMovesForCaptureType = 8
	// ходы для стадии атаки
	eventNumberOfMovesForAttackType = 9
	// текущий ход
	eventCurrentMoveType = 10
	// инициализация игроков
	eventInitPlayersType = 12
	// сборка карты
	eventBuildMapType = 13
	// конец игры
	eventFinish = 999
)

// BaseType идентификатор типа сообщения
type BaseType int

type FirstQuestionData struct {
	Type     int           `json:"type"`
	Question FirstQuestion `json:"question"`
	Answer   *Answer       `json:"answer,omitempty"`
}

type SecondQuestionData struct {
	Type          int             `json:"type"`
	Question      SecondQuestion  `json:"question"`
	PlayerOptions []*PlayerOption `json:"options,omitempty"`
	Answer        *Answer         `json:"answer,omitempty"`
}

// Event отправка событий
type Event struct {
	message interface{}
}

func NewEvent() *Event {
	return &Event{}
}

func (e *Event) marshal() []byte {
	var data []byte
	if e.message != nil {
		data, _ = json.Marshal(e.message)
	}
	return data
}

// SendToAll отправляет сообщение всем игрокам
func (e *Event) SendToAll(players map[*Connection]*Player, room string, games map[string]*Game) {
	for c := range players {
		e.SendToOne(players, room, c, games)
	}
}

// SendToOne отправляет сообщение одному игроку
func (e *Event) SendToOne(players map[*Connection]*Player, room string, c *Connection, games map[string]*Game) {
	select {
	case c.Send <- e.marshal():
	default:
		close(c.Send)
		delete(players, c)
		if len(players) == 0 {
			delete(games, room)
		}
	}
}

// InitPlayers инициализация игроков
func (e *Event) InitPlayers(players map[*Connection]*Player) *Event {
	var playersSlice []*Player
	for _, player := range players {
		playersSlice = append(playersSlice, player)
	}
	sort.SliceStable(playersSlice, func(i, j int) bool {
		return playersSlice[i].CreatedAt < playersSlice[j].CreatedAt
	})

	e.message = struct {
		BaseType `json:"type"`
		Players  []*Player `json:"players"`
	}{
		BaseType: eventInitPlayersType,
		Players:  playersSlice,
	}

	return e
}

// BuildMap информация о карте
func (e *Event) BuildMap() *Event {
	e.message = struct {
		BaseType `json:"type"`
		Map      [][]*Cell `json:"map"`
	}{
		BaseType: eventBuildMapType,
		Map:      GlobalMap,
	}

	return e
}

// NumberOfMovesForCapture кол-во ходов для стадии захвата
func (e *Event) NumberOfMovesForCapture() *Event {
	e.message = struct {
		BaseType `json:"type"`
		Turns    int `json:"turns"`
	}{
		BaseType: eventNumberOfMovesForCaptureType,
		Turns:    4,
	}

	return e
}

// NumberOfMovesForAttack ходы для стадии атаки
func (e *Event) NumberOfMovesForAttack(turns []string) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Turns    []string `json:"turns"`
	}{
		BaseType: eventNumberOfMovesForAttackType,
		Turns:    turns,
	}

	return e
}

// CurrentMove текущий ход
func (e *Event) CurrentMove(round int) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Number   int `json:"number"`
	}{
		BaseType: eventCurrentMoveType,
		Number:   round,
	}

	return e
}

// FirstQuestion вопрос первого типа
func (e *Event) FirstQuestion(question FirstQuestion) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Question FirstQuestion `json:"question"`
		Answer   *Answer       `json:"answer,omitempty"`
	}{
		BaseType: eventFirstQuestion,
		Question: question,
	}

	return e
}

// SecondQuestion вопрос второго типа
func (e *Event) SecondQuestion(question SecondQuestion) *Event {
	e.message = struct {
		BaseType      `json:"type"`
		Question      SecondQuestion  `json:"question"`
		PlayerOptions []*PlayerOption `json:"options,omitempty"`
		Answer        *Answer         `json:"answer,omitempty"`
	}{
		BaseType: eventSecondQuestionType,
		Question: question,
	}

	return e
}

// AnswerFirstQuestion ответ на вопрос первого типа
func (e *Event) AnswerFirstQuestion(answerValue string) *Event {
	e.message = &FirstQuestionData{
		Type:   eventAnswerFirstQuestionType,
		Answer: &Answer{Value: answerValue},
	}

	return e
}

// AnswerSecondQuestion ответ на вопрос второго типа
func (e *Event) AnswerSecondQuestion(playerOptions []*PlayerOption, answerValue string) *Event {
	e.message = &SecondQuestionData{
		Type:          eventAnswerSecondQuestionType,
		PlayerOptions: playerOptions,
		Answer:        &Answer{Value: answerValue},
	}

	return e
}

// SelectCell игрок получает клетки
func (e *Event) SelectCell(color string, count int) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Color    string `json:"color"`
		Count    int    `json:"count"`
	}{
		BaseType: eventSelectCellType,
		Color:    color,
		Count:    count,
	}

	return e
}

// Finish конце игры
func (e *Event) Finish() *Event {
	e.message = struct {
		BaseType `json:"type"`
	}{
		BaseType: eventFinish,
	}

	return e
}
