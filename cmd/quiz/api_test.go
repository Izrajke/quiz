package main

import (
	"bytes"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"testing"
	"time"
)

func TestApi(t *testing.T) {
	t.Run("get ID for game", func(t *testing.T) {
		go main()
		time.Sleep(300 * time.Millisecond)

		postBody, _ := json.Marshal(map[string]string{
			"test": "111",
		})
		responseBody := bytes.NewBuffer(postBody)
		resp, err := http.Post("http://localhost:8080/create", "application/json", responseBody)
		if err != nil {
			log.Fatal(err)
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}

		var response struct {
			ID string `json:"id"`
		}
		err = json.Unmarshal(body, &response)
		if err != nil {
			log.Fatal(err)
		}

		uuidValue, err := uuid.Parse(response.ID)
		if err != nil {
			log.Fatal(err)
		}

		r := regexp.MustCompile("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[8|9|aA|bB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$")
		assert.True(t, r.MatchString(uuidValue.String()))
	})
}
