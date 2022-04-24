package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"os"
	"os/signal"
	"quiz/internal/game"
	httpserver "quiz/internal/http"
	"quiz/internal/workerpool"
	"strconv"
	"sync"
	"syscall"
)

type config struct {
	httpListenPort string
	enablePprof    bool
}

func main() {
	// TODO 1. Добавить тесты для client websocket
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

	workerPool := workerpool.NewPool(ctx, logger)
	hub := game.NewHub(ctx, workerPool)
	go hub.Run()

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		logger.Info("starting service Http server", zap.String("port", cfg.httpListenPort))
		errCh := httpserver.NewServer(hub, logger).ListenAndServe(ctx, cfg.httpListenPort, cfg.enablePprof)
		err = <-errCh
		cancel()
		if err != nil {
			logger.Error("error on listen and serve api Http server", zap.Error(err))
		}
	}()

	wg.Wait()
	workerPool.Wait()
	logger.Info("application has been shutdown gracefully")
}

func newConfig() (*config, error) {
	httpListenPort, found := os.LookupEnv("CL_HTTP_LISTEN")
	if !found {
		return nil, errors.New("CL_HTTP_LISTEN environment variable not found")
	}
	enablePprof, found := os.LookupEnv("CL_ENABLE_PPROF")
	if !found {
		return nil, errors.New("CL_ENABLE_PPROF environment variable not found")
	}
	enablePprofValue, err := strconv.ParseBool(enablePprof)
	if err != nil {
		return nil, errors.New("can't parse CL_ENABLE_PPROF")
	}

	return &config{
		httpListenPort: httpListenPort,
		enablePprof:    enablePprofValue,
	}, nil
}

func newLogger() (*zap.Logger, error) {
	opts := zap.NewProductionConfig()
	opts.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	opts.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	opts.Encoding = "console"
	opts.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	return opts.Build()
}
