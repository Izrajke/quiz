package http

import (
	"context"
	"encoding/json"
	"github.com/buaazp/fasthttprouter"
	"github.com/google/uuid"
	"github.com/valyala/fasthttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"
	"net/http"
	"net/http/pprof"
	"quiz/internal/game"
)

type Server struct {
	hub    *game.Hub
	logger *zap.Logger
}

func NewServer(hub *game.Hub, logger *zap.Logger) *Server {
	return &Server{
		hub:    hub,
		logger: logger,
	}
}

func (s *Server) ListenAndServe(ctx context.Context, listen string, enablePprof bool) <-chan error {
	const pprofUrlPrefix = "/debug/pprof"
	router := fasthttprouter.New()

	router.POST("/create", s.handleGameCreate)
	router.GET("/ws", s.handleWs)

	if enablePprof {
		for _, path := range []string{"/", "/allocs", "/block", "/goroutine", "/heap", "/mutex", "/threadcreate"} {
			router.GET(pprofUrlPrefix+path, fasthttpadaptor.NewFastHTTPHandlerFunc(pprof.Index))
		}
		router.GET(pprofUrlPrefix+"/cmdline", fasthttpadaptor.NewFastHTTPHandlerFunc(pprof.Cmdline))
		router.GET(pprofUrlPrefix+"/profile", fasthttpadaptor.NewFastHTTPHandlerFunc(pprof.Profile))
		router.GET(pprofUrlPrefix+"/symbol", fasthttpadaptor.NewFastHTTPHandlerFunc(pprof.Symbol))
		router.GET(pprofUrlPrefix+"/trace", fasthttpadaptor.NewFastHTTPHandlerFunc(pprof.Trace))
		s.logger.Warn("pprof routes registered", zap.String("path", pprofUrlPrefix))
	}

	return s.runFastHttpServer(ctx, cors(router.Handler), listen)
}

func cors(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Set("Access-Control-Allow-Origin", "*")
		ctx.Response.Header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		ctx.Response.Header.Set(
			"Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
		)
		if ctx.IsOptions() {
			return
		}

		next(ctx)
	}
}

func (s *Server) handleGameCreate(ctx *fasthttp.RequestCtx) {
	id := struct {
		ID uuid.UUID `json:"id"`
	}{ID: uuid.New()}
	ctx.Response.Header.SetContentType("application/json")
	ctx.Response.SetStatusCode(http.StatusOK)

	jsonBody, _ := json.Marshal(id)
	ctx.SetBody(jsonBody)
	return
}

func (s *Server) handleWs(ctx *fasthttp.RequestCtx) {
	name := ctx.QueryArgs().Peek("name")
	room := ctx.QueryArgs().Peek("room")

	game.ServeWs(ctx, s.hub, string(name), string(room))
}

func (s *Server) runFastHttpServer(ctx context.Context, handler fasthttp.RequestHandler, listen string) <-chan error {
	ctx, cancel := context.WithCancel(ctx)
	server := &fasthttp.Server{Handler: handler}

	result := make(chan error)
	go func() {
		defer close(result)
		<-ctx.Done()
		result <- server.Shutdown()
	}()

	go func() {
		err := server.ListenAndServe(listen)
		if err != nil {
			s.logger.Error("failed to listen and serve the server", zap.Error(err))
		}
		cancel()
	}()

	return result
}
