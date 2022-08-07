package api

import (
	"encoding/json"
	"fmt"
	"github.com/georgysavva/scany/pgxscan"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/valyala/fasthttp"
	"net/http"
)

type CategoryController struct {
	db *pgxpool.Pool
}

func NewCategoryController(db *pgxpool.Pool) *CategoryController {
	return &CategoryController{
		db: db,
	}
}

type category struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
}

func (s *CategoryController) HandleFilter(ctx *fasthttp.RequestCtx) {
	var categories []*category

	err := pgxscan.Select(ctx, s.db, &categories, `SELECT id, title FROM categories`)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to select from db: %s", err.Error()))
		ctx.Error("internal server error", fasthttp.StatusInternalServerError)
		return
	}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(categories)
	ctx.SetBody(jsonBody)
}
