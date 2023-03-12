package main

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"os/signal"
	httpserver "quiz/internal/http"
	"quiz/internal/http/api"
	"quiz/internal/hub"
	"quiz/internal/storage/db"
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
	databaseUrl := "postgres://postgres:postgres@postgres-db:5432/postgres" // TODO to env
	pool, err := pgxpool.Connect(ctx, databaseUrl)
	if err != nil {
		log.Fatal(fmt.Sprintf("failed to connect to db: %s", err.Error()))
	}

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT)
	defer cancel()
	go func() {
		<-ctx.Done()
		logger.Info("received exit signal")
	}()

	defer func() {
		if msg := recover(); msg != nil {
			logger.Error("main recovered from panic", zap.Error(fmt.Errorf("%s", msg)))
		}
	}()

	wg := sync.WaitGroup{}
	gameStorage := hub.NewGameStorage()
	workerPool := workerpool.NewPool(ctx, logger)
	appHub := hub.NewHub(ctx, gameStorage, pool, workerPool, logger)
	packageStorage := db.NewPackageStorage(pool)

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting home hub")
		appHub.Home()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting game hub")
		appHub.Game()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting HTTP server", zap.String("port", cfg.httpListenPort))
		packController := api.NewPackController(pool)
		categoryController := api.NewCategoryController(pool)
		errCh := httpserver.NewServer(
			packController,
			categoryController,
			appHub,
			gameStorage,
			packageStorage,
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
