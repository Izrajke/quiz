package main

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"log"
	"net/http"
	"quiz/internal"
)

const (
	serverPort = ":8080"
)

func main() {
	go internal.H.Run()

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "home.html")
	})
	// Создание комнаты
	http.HandleFunc("/create", func(w http.ResponseWriter, r *http.Request) {
		id := uuid.New()
		if r.Method == http.MethodPost {
			id := struct {
				ID uuid.UUID `json:"id"`
			}{ID: id}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(id)
			return
		}
		http.Redirect(w, r, "/game?room="+id.String(), 301)
	})
	// Страница игры
	http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "game.html")
	})
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		roomIds, found := query["room"]
		if !found || len(roomIds) != 1 {
			fmt.Println("failed http params")
		}
		fmt.Println("Room id: " + roomIds[0])
		internal.ServeWs(w, r, roomIds[0])
	})
	err := http.ListenAndServe(serverPort, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
