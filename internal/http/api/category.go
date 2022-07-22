package api

import (
	"encoding/json"
	"github.com/valyala/fasthttp"
	"net/http"
)

type CategoryController struct{}

func NewCategoryController() *CategoryController {
	return &CategoryController{}
}

type category struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
}

var categories = []*category{
	{
		Id:    1,
		Title: "История",
	},
	{
		Id:    2,
		Title: "Литература",
	},
	{
		Id:    3,
		Title: "География",
	},
	{
		Id:    4,
		Title: "Спорт",
	},
}

func (s *CategoryController) HandleFilter(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(categories)
	ctx.SetBody(jsonBody)
}
