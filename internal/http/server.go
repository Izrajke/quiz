package http

import (
	"context"
	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
	"go.uber.org/zap"
	"net/http/pprof"
	"quiz/internal/game"
	"quiz/internal/http/api"
)

type Server struct {
	packController     *api.PackController
	categoryController *api.CategoryController
	hub                *game.Hub
	logger             *zap.Logger
}

func NewServer(
	packController *api.PackController,
	categoryController *api.CategoryController,
	hub *game.Hub,
	logger *zap.Logger,
) *Server {
	return &Server{
		packController:     packController,
		categoryController: categoryController,
		hub:                hub,
		logger:             logger.With(zap.String("channel", "http-server")),
	}
}

func (s *Server) ListenAndServe(ctx context.Context, listen string, enablePprof bool) <-chan error {
	const pprofUrlPrefix = "/debug/pprof"
	router := fasthttprouter.New()

	router.POST("/create", s.handleGameCreate)
	router.GET("/ws", s.handleWs)

	router.POST("/api/category/filter", s.categoryController.HandleFilter)

	router.POST("/api/pack/filter", s.packController.HandleFilter)
	router.POST("/api/pack/create", s.packController.HandleCreate)
	router.POST("/api/pack/update/:id", s.packController.HandleUpdate)
	router.POST("/api/pack/view/:id", s.packController.HandleView)
	router.POST("/api/pack/delete/:id", s.packController.HandleDelete)

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

func cors(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Set("Access-Control-Allow-Origin", "*")
		ctx.Response.Header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		ctx.Response.Header.Set(
			"Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
		)
		if !ctx.IsOptions() {
			next(ctx)
		}
	}
}
