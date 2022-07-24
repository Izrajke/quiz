package api

import (
	"encoding/json"
	"github.com/valyala/fasthttp"
	"math"
	"net/http"
	"strconv"
)

type PackController struct{}

func NewPackController() *PackController {
	return &PackController{}
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

	var filterShortPacks []*shortPack
	for _, currentPack := range fullPacks {
		filterShortPacks = append(filterShortPacks, &shortPack{
			Id:         currentPack.Id,
			Title:      currentPack.Title,
			CategoryId: currentPack.CategoryId,
			Rating:     3.5,
		})
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
	fullPackRequest.Id = len(fullPacks) + 1
	fullPacks = append(fullPacks, fullPackRequest)

	response := struct {
		Success bool `json:"success"`
	}{Success: true}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}

func (s *PackController) HandleUpdate(ctx *fasthttp.RequestCtx) {
	body := ctx.PostBody()

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

	fullPackRequest := &fullPack{}
	err = json.Unmarshal(body, &fullPackRequest)
	if err != nil {
		ctx.Error("bad request", fasthttp.StatusBadRequest)
		return
	}

	for i, currentPack := range fullPacks {
		if packIdInt == currentPack.Id {
			fullPacks[i] = fullPackRequest
		}
	}

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

	var viewPack *fullPack
	for _, currentPack := range fullPacks {
		if packIdInt == currentPack.Id {
			viewPack = currentPack
			break
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

	var newPacks []*fullPack
	for _, currentPack := range fullPacks {
		if packIdInt != currentPack.Id {
			newPacks = append(newPacks, currentPack)
		}
	}
	fullPacks = newPacks

	response := struct {
		Success bool `json:"success"`
	}{Success: true}

	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
	jsonBody, _ := json.Marshal(response)
	ctx.SetBody(jsonBody)
}
