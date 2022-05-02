package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"io/ioutil"
	"log"
	"net/http"
	"testing"
	"time"
)

func TestCreateGame(t *testing.T) {
	t.Run("get ID for game", func(t *testing.T) {
		go main()
		time.Sleep(300 * time.Millisecond)

		postBody, _ := json.Marshal(map[string]string{
			"test": "111",
		})
		responseBody := bytes.NewBuffer(postBody)
		resp, err := http.Post("http://localhost:8080/create", "application/json", responseBody)
		if err != nil {
			log.Fatalf("An Error Occured %v", err)
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatalln(err)
		}

		var response struct {
			ID string `json:"id"`
		}
		_ = json.Unmarshal(body, &response)

		uuidValue, err := uuid.Parse(response.ID)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(uuidValue.String())
	})
}
