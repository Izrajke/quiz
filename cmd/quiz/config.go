package main

import (
	"errors"
	"os"
	"strconv"
)

type config struct {
	httpListenPort string
	enablePprof    bool
}

func newConfig() (*config, error) {
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
		httpListenPort: httpListenPort,
		enablePprof:    enablePprofValue,
	}, nil
}
