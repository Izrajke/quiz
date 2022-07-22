package http

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"net/http"
	"quiz/internal/game"
)

func (s *Server) handleGameCreate(ctx *fasthttp.RequestCtx) {
	id := struct {
		ID uuid.UUID `json:"id"`
	}{ID: uuid.New()}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(id)
	ctx.SetBody(jsonBody)
}

func (s *Server) handleWs(ctx *fasthttp.RequestCtx) {
	name := ctx.QueryArgs().Peek("name")
	room := ctx.QueryArgs().Peek("room")
	avatar := ctx.QueryArgs().Peek("avatar")

	game.ServeWs(ctx, s.hub, s.logger, string(name), string(room), string(avatar))
}
