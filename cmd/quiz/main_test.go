package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/assert"
	"log"
	"net/url"
	"quiz/internal/domain"
	"sync"
	"testing"
	"time"
)

type serverMsg struct {
	Type int `json:"type"`
}

func TestServer(t *testing.T) {
	t.Run("game for two players", func(t *testing.T) {
		domain.Environment = "test"
		go main()

		v := url.Values{}
		v.Set("room", "123e4567-e89b-12d3-a456-426614174000")
		u := url.URL{Scheme: "ws", Host: serverPort, Path: "/ws"}

		requestChs, responseChs := func() ([]chan []byte, []chan []byte) {
			// ответы от сервера
			request1Ch := make(chan []byte, 100)

			playersInfo := &domain.EventPlayersInfo{
				Type: 12,
				Players: []*domain.Player{
					{
						Id:     "123e4567-e89b-12d3-a456-426614174001",
						Name:   "Vasily",
						Points: 300,
						Color:  "player-1",
					},
				},
			}
			msg, _ := json.Marshal(playersInfo)
			request1Ch <- msg
			mapInfo := &domain.EventMapInfo{
				Type: 13,
				Map:  domain.GlobalMap,
			}
			msg, _ = json.Marshal(mapInfo)
			request1Ch <- msg
			playersInfo = &domain.EventPlayersInfo{
				Type: 12,
				Players: []*domain.Player{
					{
						Id:     "123e4567-e89b-12d3-a456-426614174001",
						Name:   "Vasily",
						Points: 300,
						Color:  "player-1",
					},
					{
						Id:     "123e4567-e89b-12d3-a456-426614174002",
						Name:   "Ivan",
						Points: 300,
						Color:  "player-2",
					},
				},
			}
			msg, _ = json.Marshal(playersInfo)
			request1Ch <- msg

			questionCounter := 0
			questionInfo := &domain.FirstQuestionInfo{
				Type:     1,
				Question: domain.GlobalQuestions[questionCounter].Question,
			}
			msg, _ = json.Marshal(questionInfo)
			request1Ch <- msg

			answerInfo := &domain.FirstQuestionInfo{
				Type:   5,
				Answer: &domain.Answer{Value: "1"},
			}
			msg, _ = json.Marshal(answerInfo)
			request1Ch <- msg
			eventSelectCell := struct {
				Type  int    `json:"type"`
				Color string `json:"color"`
				Count int    `json:"count"`
			}{
				Type:  7,
				Color: "player-1",
				Count: 2,
			}
			msg, _ = json.Marshal(eventSelectCell)
			request1Ch <- msg
			mapInfo1 := &domain.EventMapInfo{
				Type: 13,
				Map: [][]*domain.Cell{
					{ // 0
						{ // 0
							IsExists: false,
							Owner:    "",
						},
						{ // 1
							IsExists: false,
							Owner:    "",
						},
					},
					{ // 1
						{ // 0
							IsExists: true,
							Owner:    "player-1",
						},
						{ // 1
							IsExists: true,
							Owner:    "empty",
						},
					},
					{ // 2
						{ // 0
							IsExists: true,
							Owner:    "empty",
						},
						{ // 1
							IsExists: true,
							Owner:    "empty",
						},
					},
				},
			}
			msg, _ = json.Marshal(mapInfo1)
			request1Ch <- msg
			mapInfo2 := &domain.EventMapInfo{
				Type: 13,
				Map: [][]*domain.Cell{
					{ // 0
						{ // 0
							IsExists: false,
							Owner:    "",
						},
						{ // 1
							IsExists: false,
							Owner:    "",
						},
					},
					{ // 1
						{ // 0
							IsExists: true,
							Owner:    "player-1",
						},
						{ // 1
							IsExists: true,
							Owner:    "player-1",
						},
					},
					{ // 2
						{ // 0
							IsExists: true,
							Owner:    "empty",
						},
						{ // 1
							IsExists: true,
							Owner:    "empty",
						},
					},
				},
			}
			msg, _ = json.Marshal(mapInfo2)
			request1Ch <- msg

			close(request1Ch)

			request2Ch := make(chan []byte, 100)
			msg, _ = json.Marshal(playersInfo)
			request2Ch <- msg
			msg, _ = json.Marshal(mapInfo)
			request2Ch <- msg
			msg, _ = json.Marshal(questionInfo)
			request2Ch <- msg
			msg, _ = json.Marshal(answerInfo)
			request2Ch <- msg
			msg, _ = json.Marshal(eventSelectCell)
			request2Ch <- msg
			msg, _ = json.Marshal(mapInfo1)
			request2Ch <- msg
			msg, _ = json.Marshal(mapInfo2)
			request2Ch <- msg
			close(request2Ch)

			requestChs := make([]chan []byte, 0)
			requestChs = append(requestChs, request1Ch)
			requestChs = append(requestChs, request2Ch)

			// ответы от клиента
			response1Ch := make(chan []byte, 100)

			firstQuestionInfo := struct {
				Type   int    `json:"type"`
				Option string `json:"option"`
			}{
				Type:   domain.EventReceivedAnswer,
				Option: "1",
			}

			msg, _ = json.Marshal(firstQuestionInfo)
			response1Ch <- msg

			eventGetCell := struct {
				Type      int `json:"type"`
				RowIndex  int `json:"rowIndex"`
				CellIndex int `json:"cellIndex"`
			}{
				Type:      3,
				RowIndex:  1,
				CellIndex: 0,
			}
			msg, _ = json.Marshal(eventGetCell)
			response1Ch <- msg

			eventGetCell = struct {
				Type      int `json:"type"`
				RowIndex  int `json:"rowIndex"`
				CellIndex int `json:"cellIndex"`
			}{
				Type:      3,
				RowIndex:  1,
				CellIndex: 1,
			}
			msg, _ = json.Marshal(eventGetCell)
			response1Ch <- msg

			response2Ch := make(chan []byte, 100)
			msg, _ = json.Marshal(firstQuestionInfo)
			response2Ch <- msg

			responseChs := make([]chan []byte, 0)
			responseChs = append(responseChs, response1Ch)
			responseChs = append(responseChs, response2Ch)

			return requestChs, responseChs
		}()

		var wg sync.WaitGroup
		for i, player := range []string{"Vasily", "Ivan"} {
			v.Set("name", player)
			u.RawQuery = v.Encode()

			wg.Add(1)
			go connect(t, u.String(), &wg, requestChs[i], responseChs[i], i)
			time.Sleep(time.Second)
		}
		wg.Wait()
	})
}

func connect(t *testing.T, u string, wg *sync.WaitGroup, requestCh chan []byte, responseCh chan []byte, i int) {
	defer wg.Done()

	c, _, err := websocket.DefaultDialer.Dial(u, nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	done := make(chan struct{})
	serverCh := make(chan struct{})
	getCellCh := make(chan struct{})

	go func() {
		defer close(done)
		for {
			requestMsg := <-requestCh
			if requestMsg == nil {
				return
			}

			_, message, err := c.ReadMessage()

			var msg serverMsg
			_ = json.Unmarshal(message, &msg)
			if msg.Type == 1 {
				serverCh <- struct{}{}
			}
			if msg.Type == 7 {
				getCellCh <- struct{}{}
				getCellCh <- struct{}{}
			}

			if err != nil {
				log.Println("read:", err)
				return
			}

			fmt.Printf("%d: from server %s\n", i, string(message))
			fmt.Printf("%d: from ch %s\n", i, string(requestMsg))
			assert.Equal(t, requestMsg, message)
		}
	}()

	for {
		select {
		case <-serverCh:
			err := c.WriteMessage(websocket.TextMessage, <-responseCh)
			if err != nil {
				log.Println("write:", err)
				return
			}
		case <-getCellCh:
			msg := <-responseCh
			if msg != nil {
				err := c.WriteMessage(websocket.TextMessage, msg)
				if err != nil {
					log.Println("write:", err)
					return
				}
				err = c.WriteMessage(websocket.TextMessage, <-responseCh)
				if err != nil {
					log.Println("write:", err)
					return
				}
			}
		case <-done:
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			return
		}
	}
}
