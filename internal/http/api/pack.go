package api

import (
	"encoding/json"
	"fmt"
	"github.com/georgysavva/scany/pgxscan"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/valyala/fasthttp"
	"log"
	"math"
	"net/http"
	"strconv"
)

type PackController struct {
	db *pgxpool.Pool
}

func NewPackController(db *pgxpool.Pool) *PackController {
	return &PackController{
		db: db,
	}
}

func (s *PackController) HandleFilter(ctx *fasthttp.RequestCtx) {
	body := ctx.PostBody()

	request := struct {
		Page int `json:"page"`
	}{}
	err := json.Unmarshal(body, &request)
	if err != nil {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}

	filterShortPacks := make([]*shortPack, 0)
	err = pgxscan.Select(ctx, s.db, &filterShortPacks, `SELECT id, categoryid, title FROM packages`)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to select from db: %s", err.Error()))
		ctx.Error("internal server error", fasthttp.StatusInternalServerError)
		return
	}

	for _, filterShortPack := range filterShortPacks {
		filterShortPack.Rating = 3.5
	}

	page := 1
	if request.Page != 0 {
		page = request.Page
	}
	limit := 10
	offset := (page - 1) * limit
	total := int(math.Ceil(float64(len(filterShortPacks)) / float64(limit)))

	response := struct {
		Content    []*shortPack `json:"content"`
		Pagination struct {
			CurrentPage int `json:"currentPage"`
			TotalPages  int `json:"totalPages"`
		} `json:"pagination"`
	}{
		Content: filterShortPacks[offset:],
		Pagination: struct {
			CurrentPage int `json:"currentPage"`
			TotalPages  int `json:"totalPages"`
		}{
			CurrentPage: page,
			TotalPages:  total,
		},
	}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleCreate(ctx *fasthttp.RequestCtx) {
	body := ctx.PostBody()

	fullPackRequest := &fullPack{}
	err := json.Unmarshal(body, &fullPackRequest)
	if err != nil {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}

	_, err = s.db.Query(
		ctx,
		`INSERT INTO packages (categoryId, title, data) VALUES ($1, $2, $3)`,
		fullPackRequest.CategoryId,
		fullPackRequest.Title,
		fullPackRequest.Pack,
	)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to inser to db: %s", err.Error()))
		ctx.Error("internal server error", fasthttp.StatusInternalServerError)
		return
	}

	response := struct {
		Success bool `json:"success"`
	}{Success: true}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleUpdate(ctx *fasthttp.RequestCtx) {
	response := struct {
		Success bool `json:"success"`
	}{Success: true}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleView(ctx *fasthttp.RequestCtx) {
	packIdStr, ok := ctx.UserValue("id").(string)
	if packIdStr == "" || !ok {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}
	packIdInt, err := strconv.Atoi(packIdStr)
	if err != nil {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}

	rows, err := s.db.Query(ctx, "SELECT id, categoryid, title, data FROM packages WHERE id = $1", packIdInt)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to select from db: %s", err.Error()))
		ctx.Error("internal server error", fasthttp.StatusInternalServerError)
		return
	}

	viewPack := &fullPack{}
	for rows.Next() {
		err := rows.Scan(&viewPack.Id, &viewPack.CategoryId, &viewPack.Title, &viewPack.Pack)
		if err != nil {
			log.Fatal(err)
		}
	}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(viewPack)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleDelete(ctx *fasthttp.RequestCtx) {
	packIdStr, ok := ctx.UserValue("id").(string)
	if packIdStr == "" || !ok {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}
	packIdInt, err := strconv.Atoi(packIdStr)
	if err != nil {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}

	_, err = s.db.Query(ctx, `DELETE FROM packages WHERE id = $1`, packIdInt)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to delete to db: %s", err.Error()))
		ctx.Error("internal server error", fasthttp.StatusInternalServerError)
		return
	}

	response := struct {
		Success bool `json:"success"`
	}{Success: true}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}
