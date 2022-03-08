package taskpool

import (
	"context"
	"errors"
	"fmt"
	"sync"
)

type status string

const (
	StatusReady   status = "ready"
	StatusRunning status = "running"
	StatusDone    status = "done"
)

var TaskIsRunningError = errors.New("task is running")
var TaskIsDoneError = errors.New("task is done")

type Task struct {
	f      func(context.Context)
	err    error
	status status
}

func NewTask(f func(context.Context)) *Task {
	return &Task{
		f:      f,
		status: StatusReady,
	}
}

func (t *Task) Run(ctx context.Context) error {
	if t.status == StatusRunning {
		return TaskIsRunningError
	}
	if t.status == StatusDone {
		return TaskIsDoneError
	}

	t.status = StatusRunning

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer func() {
			if msg := recover(); msg != nil {
				t.err = fmt.Errorf("%s", msg)
			}
		}()
		defer func() {
			t.status = StatusDone
		}()

		t.f(ctx)
	}()
	wg.Wait()

	return t.err
}
