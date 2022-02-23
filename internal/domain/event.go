package domain

import (
	"encoding/json"
	"sort"
)

const (
	// Клиентские типы

	// EventReceivedAnswer получение ответа на вопрос первого типа
	EventReceivedAnswer = 1
	// EventReceivedNextFirstQuestion получение запроса на отправку вопроса первого типа
	EventReceivedNextFirstQuestion = 2
	// EventReceivedGetMapCell получение ячейки на карте
	EventReceivedGetMapCell = 3
	// EventMapAttack нападение на клетку противника
	EventMapAttack = 4

	// Серверные типы

	// информация о вопросе первого типа
	eventFirstQuestion = 1
	// информация о вопросе второго типа
	eventSecondQuestion = 2
	// информация о ответе на вопрос первого типа
	eventAnswerFirstQuestion = 5
	// информация о получении клетки
	eventSelectCell = 7
	// информация о игроках
	eventPlayersIntoType = 12
	// информация о карте
	eventMap = 13
	// информация о начале стадии нападений
	eventMapAllowAttack = 15
	// информация о конце игры
	eventFinish = 999
)

// BaseType идентификатор типа сообщения
type BaseType int

// Event отправка и получение событий
type Event struct {
	message interface{}
}

type FirstQuestionInfo struct {
	Type     int      `json:"type"`
	Question Question `json:"question"`
	Answer   *Answer  `json:"answer,omitempty"`
}

type EventPlayersInfo struct {
	Type    int       `json:"type"`
	Players []*Player `json:"players"`
}

type EventMapInfo struct {
	Type int       `json:"type"`
	Map  [][]*Cell `json:"map"`
}

type CustomEvent struct {
	Type int `json:"type"`
}

func NewEvent() *Event {
	return &Event{}
}

// FirstQuestionInfo информация о вопросе первого типа
func (e *Event) FirstQuestionInfo(question Question) *Event {
	e.message = &FirstQuestionInfo{
		Type:     eventFirstQuestion,
		Question: question,
	}

	return e
}

// AnswerFirstQuestionInfo информация о ответе на вопрос первого типа
func (e *Event) AnswerFirstQuestionInfo(answerValue string) *Event {
	e.message = &FirstQuestionInfo{
		Type:   eventAnswerFirstQuestion,
		Answer: &Answer{Value: answerValue},
	}

	return e
}

// SelectCellInfo информация о получении клетки
func (e *Event) SelectCellInfo(color string) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Color    string `json:"color"`
		Count    int    `json:"count"`
	}{
		BaseType: eventSelectCell,
		Color:    color,
		Count:    2,
	}

	return e
}

// PlayersInfo информация о игроках
func (e *Event) PlayersInfo(players map[*Connection]*Player) *Event {
	var playersSlice []*Player
	for _, player := range players {
		playersSlice = append(playersSlice, player)
	}
	sort.SliceStable(playersSlice, func(i, j int) bool {
		return playersSlice[i].createdAt < playersSlice[j].createdAt
	})

	e.message = &EventPlayersInfo{
		Type:    eventPlayersIntoType,
		Players: playersSlice,
	}

	return e
}

// MapInfo информация о карте
func (e *Event) MapInfo() *Event {
	e.message = &EventMapInfo{
		Type: eventMap,
		Map:  GlobalMap,
	}

	return e
}

// MapAllowAttackInfo информация о начале стадии нападений
func (e *Event) MapAllowAttackInfo() *Event {
	e.message = struct {
		BaseType `json:"type"`
	}{
		BaseType: eventMapAllowAttack,
	}

	return e
}

// FinishInfo информация о конце игры
func (e *Event) FinishInfo() *Event {
	e.message = &CustomEvent{
		Type: eventFinish,
	}

	return e
}

func (e *Event) Marshal() []byte {
	var data []byte
	if e.message != nil {
		data, _ = json.Marshal(e.message)
	}
	return data
}
