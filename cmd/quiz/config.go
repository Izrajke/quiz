package main

import (
	"errors"
	"os"
	"strconv"
)

const (
	appProd environment = "prod"
)

type environment string

func (e environment) isProduction() bool {
	return e != appProd
}

type config struct {
	environment    environment
	httpListenPort string
	enablePprof    bool
}

func newConfig() (*config, error) {
	env, found := os.LookupEnv("APP_ENV")
	if !found {
		return nil, errors.New("APP_ENV variable not found")
	}
	httpListenPort, found := os.LookupEnv("APP_HTTP_LISTEN")
	if !found {
		return nil, errors.New("APP_HTTP_LISTEN variable not found")
	}
	enablePprof, found := os.LookupEnv("APP_ENABLE_PPROF")
	if !found {
		return nil, errors.New("APP_ENABLE_PPROF variable not found")
	}
	enablePprofValue, err := strconv.ParseBool(enablePprof)
	if err != nil {
		return nil, errors.New("can't parse APP_ENABLE_PPROF")
	}

	return &config{
		environment:    environment(env),
		httpListenPort: httpListenPort,
		enablePprof:    enablePprofValue,
	}, nil
}
