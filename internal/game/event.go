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
	// сообщение из чата
	eventChatMessageType = 100
	// информация об ожидающих комнатах
	eventWaitingRoomsType = 101
	// конец игры
	eventFinish = 999
)

// BaseType идентификатор типа сообщения
type BaseType int

type FirstQuestionData struct {
	Type     int           `json:"type"`
	Question firstQuestion `json:"question"`
	Answer   *answer       `json:"answer,omitempty"`
}

type SecondQuestionData struct {
	Type          int             `json:"type"`
	Question      secondQuestion  `json:"question"`
	PlayerOptions []*PlayerOption `json:"options,omitempty"`
	Answer        *answer         `json:"answer,omitempty"`
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
func (e *Event) SendToAll(players map[*Connection]*player, room string, games map[string]*Game) {
	for c := range players {
		e.SendToOne(players, room, c, games)
	}
}

// SendToOne отправляет сообщение одному игроку
func (e *Event) SendToOne(players map[*Connection]*player, room string, c *Connection, games map[string]*Game) {
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
func (e *Event) InitPlayers(players map[*Connection]*player) *Event {
	var playersSlice []*player
	for _, player := range players {
		playersSlice = append(playersSlice, player)
	}
	sort.SliceStable(playersSlice, func(i, j int) bool {
		return playersSlice[i].CreatedAt < playersSlice[j].CreatedAt
	})

	e.message = struct {
		BaseType `json:"type"`
		Players  []*player `json:"players"`
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
		Map      [][]*cell `json:"map"`
	}{
		BaseType: eventBuildMapType,
		Map:      globalMap,
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

// firstQuestion вопрос первого типа
func (e *Event) FirstQuestion(question firstQuestion) *Event {
	e.message = struct {
		BaseType `json:"type"`
		Question firstQuestion `json:"question"`
		Answer   *answer       `json:"answer,omitempty"`
	}{
		BaseType: eventFirstQuestion,
		Question: question,
	}

	return e
}

// secondQuestion вопрос второго типа
func (e *Event) SecondQuestion(question secondQuestion) *Event {
	e.message = struct {
		BaseType      `json:"type"`
		Question      secondQuestion  `json:"question"`
		PlayerOptions []*PlayerOption `json:"options,omitempty"`
		Answer        *answer         `json:"answer,omitempty"`
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
		Answer: &answer{Value: answerValue},
	}

	return e
}

// AnswerSecondQuestion ответ на вопрос второго типа
func (e *Event) AnswerSecondQuestion(playerOptions []*PlayerOption, answerValue string) *Event {
	e.message = &SecondQuestionData{
		Type:          eventAnswerSecondQuestionType,
		PlayerOptions: playerOptions,
		Answer:        &answer{Value: answerValue},
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

// ChatMessage сообщение из чата
func (e *Event) ChatMessage(message string, playerName string, time int) []byte {
	e.message = struct {
		BaseType `json:"type"`
		Message  string `json:"message"`
		Author   string `json:"author"`
		Time     int    `json:"time"`
	}{
		BaseType: eventChatMessageType,
		Message:  message,
		Author:   playerName,
		Time:     time,
	}

	return e.marshal()
}

// WaitingRooms информация об ожидающих комнатах
func (e *Event) WaitingRooms(games map[string]*Game) []byte {
	type Room struct {
		ID               string   `json:"id"`
		MaximumOfPlayers int      `json:"maximumOfPlayers"`
		Name             string   `json:"name"`
		Players          []string `json:"players"`
	}
	rooms := make([]*Room, 0)
	for id, game := range games {
		if !game.IsFullPlayers() {
			players := make([]string, 0)
			for _, player := range game.Players {
				players = append(players, player.Name)
			}
			room := &Room{
				ID:               id,
				MaximumOfPlayers: 2,
				Name:             "test_name",
				Players:          players,
			}
			rooms = append(rooms, room)
		}
	}

	e.message = struct {
		BaseType `json:"type"`
		Rooms    []*Room `json:"rooms"`
	}{
		BaseType: eventWaitingRoomsType,
		Rooms:    rooms,
	}

	return e.marshal()
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
