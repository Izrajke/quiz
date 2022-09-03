package http

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"net/http"
	"quiz/internal/hub"
)

type newGameRequest struct {
	Name     string `json:"name"`
	PackID   int    `json:"packId"`
	Password string `json:"password"`
	Players  int    `json:"players"`
}

type newGameResponse struct {
	ID string `json:"id"`
}

func (s *Server) handleGameCreate(ctx *fasthttp.RequestCtx) {
	request := &newGameRequest{}
	err := json.Unmarshal(ctx.PostBody(), &request)
	if err != nil {
		ctx.Error("internal error", fasthttp.StatusInternalServerError)
		return
	}

	gameID := uuid.New().String()
	fullPackage := s.packageStorage.SelectOne(ctx, request.PackID)
	game := hub.NewGame(request.PackID, request.Name, request.Password, request.Players, fullPackage)
	s.gameStorage.Set(gameID, game)

	jsonBody, _ := json.Marshal(&newGameResponse{ID: gameID})
	ctx.SetBody(jsonBody)
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)
}

func (s *Server) handleWs(ctx *fasthttp.RequestCtx) {
	name := ctx.QueryArgs().Peek("name")
	room := ctx.QueryArgs().Peek("room")
	avatar := ctx.QueryArgs().Peek("avatar")

	hub.ServeWs(ctx, s.hub, s.logger, string(name), string(room), string(avatar))
}
