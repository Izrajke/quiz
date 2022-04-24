package workerpool

import (
	"context"
	"errors"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"math"
	"sync"
)

var PoolClosedError = errors.New("pool closed")

type Pool struct {
	ctx       context.Context
	logger    *zap.Logger
	wg        sync.WaitGroup
	done      chan struct{}
	closed    *atomic.Bool
	collector chan *Task
}

func NewPool(ctx context.Context, logger *zap.Logger) *Pool {
	pool := &Pool{
		ctx: ctx,
		// TODO add channel
		logger:    logger,
		done:      make(chan struct{}),
		closed:    atomic.NewBool(false),
		collector: make(chan *Task, math.MaxInt16),
	}

	go pool.waitDone()
	go pool.handle()

	return pool
}

// waitDone ожидает завершение контекста и запускает процедуру завершения работы пула
func (p *Pool) waitDone() {
	<-p.ctx.Done()
	p.closed.Store(true)
	close(p.collector)
}

// handle запускает задачи в горутине с контролем ее завершения
func (p *Pool) handle() {
	for task := range p.collector {
		p.wg.Add(1)
		go func(task *Task) {
			defer p.wg.Done()
			err := task.Run(p.ctx)
			if err != nil {
				p.logger.Error("Failed run task", zap.Error(err))
			}
		}(task)
	}
	close(p.done)
}

func (p *Pool) AddTask(task *Task) error {
	if p.closed.Load() {
		return PoolClosedError
	}

	p.collector <- task

	return nil
}

// Wait ожидает когда закроется пул и завершатся все задачи в пуле
func (p *Pool) Wait() {
	<-p.done
	p.wg.Wait()
}
