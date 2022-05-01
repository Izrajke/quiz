package workerpool

import (
	"context"
	"fmt"
	"sync"
)

type Worker struct {
	function func(context.Context)
	err      error
}

func NewTask(function func(context.Context)) *Worker {
	return &Worker{
		function: function,
	}
}

// run запускает воркер
func (t *Worker) run(ctx context.Context) error {
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer func() {
			if msg := recover(); msg != nil {
				t.err = fmt.Errorf("%s", msg)
			}
		}()

		t.function(ctx)
	}()
	wg.Wait()

	return t.err
}
