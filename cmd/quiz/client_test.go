package main

import (
	"encoding/json"
	"github.com/fasthttp/websocket"
	"github.com/stretchr/testify/assert"
	"log"
	"net/url"
	"sync"
	"testing"
	"time"
)

type responseServer struct {
	MessageType int `json:"type"`
}

type mockSocketMessage struct {
	responseCh chan *responseServer
	requestCh  chan []byte
}

func TestGameWebsocket(t *testing.T) {
	t.Run("2 players", func(t *testing.T) {
		go main()
		time.Sleep(time.Second)

		v := url.Values{}
		v.Set("room", "123e4567-e89b-12d3-a456-426614174000")
		u := url.URL{Scheme: "ws", Host: ":8080", Path: "/ws"}

		players := []string{"Player1", "Player2"}

		mockSocketMessages := gameScenario()

		wg := sync.WaitGroup{}
		for i, player := range players {
			v.Set("name", player)
			u.RawQuery = v.Encode()

			wg.Add(1)
			go connect(t, &wg, u.String(), mockSocketMessages[i])
			time.Sleep(time.Second)
		}
		wg.Wait()
	})
}

func TestHomeChatWebsocket(t *testing.T) {
	t.Run("chat", func(t *testing.T) {
		go main()
		time.Sleep(time.Second)

		v := url.Values{}
		u := url.URL{Scheme: "ws", Host: ":8080", Path: "/ws"}

		players := []string{"Player1", "Player2"}

		mockSocketMessages := homeChatScenario()

		wg := sync.WaitGroup{}
		for i, player := range players {
			v.Set("name", player)
			u.RawQuery = v.Encode()

			wg.Add(1)
			go connect(t, &wg, u.String(), mockSocketMessages[i])
		}

		wg.Wait()
	})
}

func TestHomeWaitingRoomsWebsocket(t *testing.T) {
	t.Run("waiting rooms", func(t *testing.T) {
		go main()
		time.Sleep(time.Second)

		v := url.Values{}
		u := url.URL{Scheme: "ws", Host: ":8080", Path: "/ws"}

		mockSocketMessages := homeWaitingRoomsScenario()

		wg := sync.WaitGroup{}
		v.Set("name", "Player1")
		u.RawQuery = v.Encode()

		wg.Add(1)
		go connect(t, &wg, u.String(), mockSocketMessages[0])

		v = url.Values{}
		v.Set("room", "123e4567-e89b-12d3-a456-426614174000")
		u = url.URL{Scheme: "ws", Host: ":8080", Path: "/ws"}

		players := []string{"Player2", "Player3"}

		for i, player := range players {
			v.Set("name", player)
			u.RawQuery = v.Encode()

			wg.Add(1)
			go connect(t, &wg, u.String(), mockSocketMessages[i+1])
			time.Sleep(time.Second)
		}
		wg.Wait()
	})
}

func homeChatScenario() []*mockSocketMessage {
	player1ResponseCh := make(chan *responseServer, 100)
	player1RequestCh := make(chan []byte, 100)

	player2ResponseCh := make(chan *responseServer, 100)
	player2RequestCh := make(chan []byte, 100)

	// --- start scenario messages

	// ожидание
	player1ResponseCh <- &responseServer{MessageType: 0}
	player2ResponseCh <- &responseServer{MessageType: 0}
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет сообщение
	player1RequestCh <- []byte(`{"type": 10, "message": "тест чат"}`)

	player1ResponseCh <- &responseServer{MessageType: 100} // chat message
	player2ResponseCh <- &responseServer{MessageType: 100} // chat message

	// --- end scenario messages

	close(player1ResponseCh)
	close(player1RequestCh)
	close(player2ResponseCh)
	close(player2RequestCh)

	socketMessages := make([]*mockSocketMessage, 0)
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player1ResponseCh,
		requestCh:  player1RequestCh,
	})
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player2ResponseCh,
		requestCh:  player2RequestCh,
	})

	return socketMessages
}

func homeWaitingRoomsScenario() []*mockSocketMessage {
	player1ResponseCh := make(chan *responseServer, 100)
	player1RequestCh := make(chan []byte, 100)

	player2ResponseCh := make(chan *responseServer, 100)
	player2RequestCh := make(chan []byte, 100)

	player3ResponseCh := make(chan *responseServer, 100)
	player3RequestCh := make(chan []byte, 100)

	// --- start scenario messages

	player1ResponseCh <- &responseServer{MessageType: 101} // waiting rooms message
	player1ResponseCh <- &responseServer{MessageType: 101} // waiting rooms message

	// ожидание
	player2ResponseCh <- &responseServer{MessageType: 0}
	player3ResponseCh <- &responseServer{MessageType: 0}

	// --- end scenario messages

	close(player1ResponseCh)
	close(player1RequestCh)
	close(player2ResponseCh)
	close(player2RequestCh)
	close(player3ResponseCh)
	close(player3RequestCh)

	socketMessages := make([]*mockSocketMessage, 0)
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player1ResponseCh,
		requestCh:  player1RequestCh,
	})
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player2ResponseCh,
		requestCh:  player2RequestCh,
	})
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player3ResponseCh,
		requestCh:  player3RequestCh,
	})

	return socketMessages
}

func gameScenario() []*mockSocketMessage {
	player1ResponseCh := make(chan *responseServer, 100)
	player1RequestCh := make(chan []byte, 100)

	player2ResponseCh := make(chan *responseServer, 100)
	player2RequestCh := make(chan []byte, 100)

	// --- start scenario messages

	player1ResponseCh <- &responseServer{MessageType: 12} // players info
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 12} // players info
	// обновлённая информация о игроках
	player1ResponseCh <- &responseServer{MessageType: 12} // players info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	player1ResponseCh <- &responseServer{MessageType: 8}  // turns info
	player1ResponseCh <- &responseServer{MessageType: 10} // current turn info
	player1ResponseCh <- &responseServer{MessageType: 2}  // second type question
	player2ResponseCh <- &responseServer{MessageType: 8}  // turns info
	player2ResponseCh <- &responseServer{MessageType: 10} // current turn info
	player2ResponseCh <- &responseServer{MessageType: 2}  // second type question
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранный ответ
	player1RequestCh <- []byte(`{"type": 1, "option": "50"}`)
	player2RequestCh <- []byte(`{"type": 1, "option": "51"}`)
	player1ResponseCh <- &responseServer{MessageType: 6} // answer info
	player2ResponseCh <- &responseServer{MessageType: 6} // answer info
	player1ResponseCh <- &responseServer{MessageType: 7} // winner select cell
	player2ResponseCh <- &responseServer{MessageType: 7} // winner select cell
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранную клетку
	player1RequestCh <- []byte(`{"type": 3, "rowIndex": 0, "cellIndex": 0}`)
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранную клетку
	player1RequestCh <- []byte(`{"type": 3, "rowIndex": 0, "cellIndex": 1}`)
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	player1ResponseCh <- &responseServer{MessageType: 7}  // second winner select cell
	player2ResponseCh <- &responseServer{MessageType: 7}  // second winner select cell
	// инициируем отправку сообщения от клиента
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранную клетку
	player2RequestCh <- []byte(`{"type": 3, "rowIndex": 0, "cellIndex": 2}`)
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	player1ResponseCh <- &responseServer{MessageType: 10} // current turn info
	player2ResponseCh <- &responseServer{MessageType: 10} // current turn info
	player1ResponseCh <- &responseServer{MessageType: 9}  // attack turns info
	player2ResponseCh <- &responseServer{MessageType: 9}  // attack turns info
	player1ResponseCh <- &responseServer{MessageType: 7}  // attack cell
	player2ResponseCh <- &responseServer{MessageType: 7}  // attack cell

	// repeat game cycle

	// инициируем отправку сообщения от клиента
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет атакованную клетку
	player2RequestCh <- []byte(`{"type": 4, "rowIndex": 0, "cellIndex": 1}`)
	player1ResponseCh <- &responseServer{MessageType: 1} // first type question
	player2ResponseCh <- &responseServer{MessageType: 1} // first type question
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранный ответ
	player1RequestCh <- []byte(`{"type": 1, "option": "1"}`)
	player2RequestCh <- []byte(`{"type": 1, "option": "2"}`)
	player1ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player2ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	player1ResponseCh <- &responseServer{MessageType: 7}  // attack cell
	player2ResponseCh <- &responseServer{MessageType: 7}  // attack cell

	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет атакованную клетку
	player1RequestCh <- []byte(`{"type": 4, "rowIndex": 0, "cellIndex": 2}`)
	player1ResponseCh <- &responseServer{MessageType: 1} // first type question
	player2ResponseCh <- &responseServer{MessageType: 1} // first type question
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранный ответ
	player1RequestCh <- []byte(`{"type": 1, "option": "1"}`)
	player2RequestCh <- []byte(`{"type": 1, "option": "2"}`)
	player1ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player2ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info
	player1ResponseCh <- &responseServer{MessageType: 7}  // attack cell
	player2ResponseCh <- &responseServer{MessageType: 7}  // attack cell

	// инициируем отправку сообщения от клиента
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет атакованную клетку
	player2RequestCh <- []byte(`{"type": 4, "rowIndex": 0, "cellIndex": 1}`)
	player1ResponseCh <- &responseServer{MessageType: 1} // first type question
	player2ResponseCh <- &responseServer{MessageType: 1} // first type question
	// инициируем отправку сообщения от клиента
	player1ResponseCh <- &responseServer{MessageType: -1}
	player2ResponseCh <- &responseServer{MessageType: -1}
	// клиент отправляет выбранный ответ
	player1RequestCh <- []byte(`{"type": 1, "option": "3"}`)
	player2RequestCh <- []byte(`{"type": 1, "option": "4"}`)
	player1ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player2ResponseCh <- &responseServer{MessageType: 5}  // answer info
	player1ResponseCh <- &responseServer{MessageType: 13} // map info
	player2ResponseCh <- &responseServer{MessageType: 13} // map info

	player1ResponseCh <- &responseServer{MessageType: 999} // end game
	player2ResponseCh <- &responseServer{MessageType: 999} // end game

	// --- end scenario messages

	close(player1ResponseCh)
	close(player1RequestCh)
	close(player2ResponseCh)
	close(player2RequestCh)

	socketMessages := make([]*mockSocketMessage, 0)
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player1ResponseCh,
		requestCh:  player1RequestCh,
	})
	socketMessages = append(socketMessages, &mockSocketMessage{
		responseCh: player2ResponseCh,
		requestCh:  player2RequestCh,
	})

	return socketMessages
}

func connect(t *testing.T, wg *sync.WaitGroup, url string, mockSocketMessage *mockSocketMessage) {
	defer wg.Done()

	c, _, err := websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer c.Close()

	allowSendToServer := make(chan struct{})
	closeWs := make(chan struct{})

	go func() {
		defer close(closeWs)
		for {
			mockResponse := <-mockSocketMessage.responseCh
			if mockResponse == nil {
				time.Sleep(time.Second)
				return
			}
			// ожидание
			if mockResponse.MessageType == 0 {
				time.Sleep(time.Second)
				continue
			}
			// инициируем отправку сообщения от клиента
			if mockResponse.MessageType == -1 {
				allowSendToServer <- struct{}{}
				continue
			}

			_, message, err := c.ReadMessage()
			if err != nil {
				log.Fatal(err)
			}

			var responseMessage responseServer
			err = json.Unmarshal(message, &responseMessage)
			if err != nil {
				log.Fatal(err)
			}

			assert.Equal(t, mockResponse.MessageType, responseMessage.MessageType)
		}
	}()

	for {
		select {
		case <-allowSendToServer:
			err := c.WriteMessage(websocket.TextMessage, <-mockSocketMessage.requestCh)
			if err != nil {
				log.Fatal(err)
			}
		case <-closeWs:
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseGoingAway, ""))
			if err != nil {
				log.Fatal(err)
			}
			return
		}
	}
}
