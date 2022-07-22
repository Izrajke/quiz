package api

import (
	"encoding/json"
	"github.com/valyala/fasthttp"
	"net/http"
)

type PackController struct{}

func NewPackController() *PackController {
	return &PackController{}
}

type pack struct {
	Id       int     `json:"id"`
	Title    string  `json:"title"`
	Category string  `json:"category"`
	Rating   float32 `json:"rating"`
}

var packs = []*pack{
	{
		Id:       1,
		Title:    "Тестовое название 1",
		Category: "История",
		Rating:   1.3,
	},
	{
		Id:       2,
		Title:    "Тестовое название 2",
		Category: "История",
		Rating:   2.3,
	},
	{
		Id:       3,
		Title:    "Тестовое название 3",
		Category: "История",
		Rating:   3.3,
	},
	{
		Id:       4,
		Title:    "Тестовое название 4",
		Category: "Литература",
		Rating:   4.3,
	},
	{
		Id:       5,
		Title:    "Тестовое название 5",
		Category: "Литература",
		Rating:   1.3,
	},
	{
		Id:       6,
		Title:    "Тестовое название 6",
		Category: "География",
		Rating:   4.3,
	},
	{
		Id:       7,
		Title:    "Тестовое название 7",
		Category: "География",
		Rating:   2.3,
	},
	{
		Id:       8,
		Title:    "Тестовое название 8",
		Category: "География",
		Rating:   3.3,
	},
	{
		Id:       9,
		Title:    "Тестовое название 9",
		Category: "Спорт",
		Rating:   4.3,
	},
	{
		Id:       10,
		Title:    "Тестовое название 10",
		Category: "Спорт",
		Rating:   1.3,
	},
	{
		Id:       11,
		Title:    "Тестовое название 11",
		Category: "Спорт",
		Rating:   1.3,
	},
}

func (s *PackController) HandleFilter(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(packs)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleCreate(ctx *fasthttp.RequestCtx) {
	response := struct {
		Field int `json:"test"`
	}{Field: 1}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleUpdate(ctx *fasthttp.RequestCtx) {
	response := struct {
		Field int `json:"test"`
	}{Field: 1}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleView(ctx *fasthttp.RequestCtx) {
	response := struct {
		Field int `json:"test"`
	}{Field: 1}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleDelete(ctx *fasthttp.RequestCtx) {
	response := struct {
		Field int `json:"test"`
	}{Field: 1}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}
