package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"quiz/internal"
	"quiz/internal/taskpool"
	"strconv"
	"sync"
)

const (
	serverPort = ":8080"
)

func main() {
	defer func() {
		if msg := recover(); msg != nil {
			fmt.Println("Recovered from panic", msg)
		}
	}()

	ctx := context.Background()
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	taskPool := taskpool.NewPool(ctx, logger)

	hub := internal.NewHub(ctx, taskPool)
	go hub.Run()

	fmt.Println("Starting server...")

	// Создание комнаты
	http.HandleFunc("/create", func(w http.ResponseWriter, r *http.Request) {
		id := uuid.New()
		// enable cors
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set(
			"Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
		)
		if r.Method == "OPTIONS" {
			return
		}
		if r.Method == http.MethodPost {
			id := struct {
				ID uuid.UUID `json:"id"`
			}{ID: id}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(id)
			return
		}
	})
	// Подключение к сокету
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		params, _ := url.ParseQuery(r.URL.RawQuery)
		// Получаем имя игрока
		playerName := "Аноним " + strconv.Itoa(rand.Intn(99))
		if len(params["name"]) > 0 {
			playerName = params["name"][0]
		}
		// Получаем id комнаты
		var roomId string
		if len(params["room"]) > 0 {
			roomId = params["room"][0]
		}
		if roomId == "" {
			fmt.Println("Failed to get room id")
			return
		}

		internal.ServeWs(w, r, hub, playerName, roomId)
	})

	wg := sync.WaitGroup{}

	wg.Add(1)
	go func() {
		defer wg.Done()
		err := http.ListenAndServe(serverPort, nil)
		if err != nil {
			log.Fatal("ListenAndServe: ", err)
		}
	}()

	wg.Wait()
	taskPool.Wait()
	logger.Info("Application has been shutdown gracefully")
}
