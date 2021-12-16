package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
)

type finish struct {
	Type int `json:"type"`
}

func (h *hub) start() {
	for {
		select {
		case gameCh := <-h.gameCh:
			go func(gameCh *game) {

				if gameCh.round == 5 {
					for _, con := range gameCh.connections {
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

				for _, con := range gameCh.connections {
					questionJson, _ := json.Marshal(questions[gameCh.round-1])
					err := con.ws.WriteMessage(websocket.TextMessage, questionJson)
					if err != nil {
						log.Println("Error during message writing:", err)
						break
					}
				}

			}(gameCh)
		}
	}
}
