package main

import (
	"fmt"
	"github.com/google/uuid"
	"log"
	"net/http"
)

const serverPort = ":8080"

func main() {
	go h.run()
	go h.start()

	// TODO
	// 1. Добавить zap логгер

	// Главная страница
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../../web/home.html")
	})
	// Создание комнаты
	http.HandleFunc("/create", func(w http.ResponseWriter, r *http.Request) {
		id := uuid.New()
		http.Redirect(w, r, "/game?room="+id.String(), 301)
	})
	// Страница игры
	http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../../web/game.html")
	})
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		roomIds, found := query["room"]
		if !found || len(roomIds) != 1 {
			fmt.Println("failed http params")
		}
		fmt.Println("Room id: " + roomIds[0])
		serveWs(w, r, roomIds[0])
	})
	err := http.ListenAndServe(serverPort, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
