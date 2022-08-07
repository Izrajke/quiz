package main

import (
	"context"
	"fmt"
	_ "github.com/georgysavva/scany/pgxscan"
	"github.com/jackc/pgx/v4/pgxpool"
	_ "github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"os/signal"
	"quiz/internal/game"
	httpserver "quiz/internal/http"
	"quiz/internal/http/api"
	"quiz/internal/workerpool"
	"sync"
	"syscall"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(fmt.Sprintf("failed to loading .env file: %s", err.Error()))
	}

	cfg, err := newConfig()
	if err != nil {
		log.Fatal(fmt.Sprintf("failed to create new config: %s", err.Error()))
	}

	logger, err := newLogger()
	if err != nil {
		log.Fatal(fmt.Sprintf("failed to create new logger: %s", err.Error()))
	}

	ctx := context.Background()
	// init db
	databaseUrl := "postgres://postgres:postgres@127.0.0.1:5432/postgres"
	db, _ := pgxpool.Connect(ctx, databaseUrl)

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT)
	defer cancel()
	go func() {
		<-ctx.Done()
		logger.Info("received exit signal")
	}()

	defer func() {
		if msg := recover(); msg != nil {
			logger.Error("recovered from panic", zap.Error(fmt.Errorf("%s", msg)))
		}
	}()

	wg := sync.WaitGroup{}
	workerPool := workerpool.NewPool(ctx, logger)
	hub := game.NewHub(ctx, workerPool, logger)

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting home hub")
		hub.Home()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting game hub")
		hub.Game()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting HTTP server", zap.String("port", cfg.httpListenPort))
		packController := api.NewPackController(db)
		categoryController := api.NewCategoryController(db)
		errCh := httpserver.NewServer(
			packController,
			categoryController,
			hub,
			logger,
		).ListenAndServe(ctx, cfg.httpListenPort, cfg.enablePprof)
		err = <-errCh
		cancel()
		if err != nil {
			logger.Error("error on listen and serve api HTTP server", zap.Error(err))
		}
	}()

	wg.Wait()
	workerPool.Wait()
	logger.Info("application has been shutdown gracefully")
}

func newLogger() (*zap.Logger, error) {
	opts := zap.NewProductionConfig()
	opts.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	opts.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02T15:04:05")
	opts.Encoding = "console"
	opts.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	return opts.Build()
}
