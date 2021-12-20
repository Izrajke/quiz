package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type finish struct {
	Type int `json:"type"`
}

func (h *hub) start() {
	for {
		select {
		case receivedGame := <-h.gameCh:
			go func(game *game) {

				if game.round == 4 {
					if game.state == GameStateWaitAnswers {
						for _, con := range game.connections {
							question := questions[game.firstQuestionCounter]
							answer := &FirstQuestionAnswer{
								Type:   5,
								Answer: Answer{Value: question.Answer.Value},
							}

							answerJson, _ := json.Marshal(answer)
							err := con.ws.WriteMessage(websocket.TextMessage, answerJson)
							if err != nil {
								log.Println("Error during message writing:", err)
								break
							}
						}
					}
					time.Sleep(2 * time.Second)
					for _, con := range game.connections {
						finish := &finish{Type: 999}
						finishJson, _ := json.Marshal(finish)
						err := con.ws.WriteMessage(websocket.TextMessage, finishJson)
						if err != nil {
							log.Println("Error during message writing:", err)
							break
						}
					}
					return
				}

				if game.state == GameStateSendFirstQuestion {
					for _, con := range game.connections {
						question := questions[game.firstQuestionCounter]
						question.Answer = nil

						questionJson, _ := json.Marshal(question)
						err := con.ws.WriteMessage(websocket.TextMessage, questionJson)
						if err != nil {
							log.Println("Error during message writing:", err)
							break
						}
					}
					game.state = GameStateWaitAnswers
				} else if game.state == GameStateWaitAnswers {
					for _, con := range game.connections {
						question := questions[game.firstQuestionCounter]
						answer := &FirstQuestionAnswer{
							Type:   5,
							Answer: Answer{Value: question.Answer.Value},
						}

						answerJson, _ := json.Marshal(answer)
						err := con.ws.WriteMessage(websocket.TextMessage, answerJson)
						if err != nil {
							log.Println("Error during message writing:", err)
							break
						}
					}
					game.firstQuestionCounter++
					game.state = GameStateSendFirstQuestion
					game.round++
					time.Sleep(2 * time.Second)
					// TODO
					for _, con := range game.connections {
						question := questions[game.firstQuestionCounter]
						question.Answer = nil

						questionJson, _ := json.Marshal(question)
						err := con.ws.WriteMessage(websocket.TextMessage, questionJson)
						if err != nil {
							log.Println("Error during message writing:", err)
							break
						}
					}
					game.state = GameStateWaitAnswers
				}

			}(receivedGame)
		}
	}
}
