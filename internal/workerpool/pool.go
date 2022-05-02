package workerpool

import (
	"context"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"math"
	"sync"
)

type Pool struct {
	wg        sync.WaitGroup
	ctx       context.Context
	done      chan struct{}
	closed    *atomic.Bool
	collector chan *Worker
	logger    *zap.Logger
}

func NewPool(ctx context.Context, logger *zap.Logger) *Pool {
	pool := &Pool{
		ctx:       ctx,
		done:      make(chan struct{}),
		closed:    atomic.NewBool(false),
		collector: make(chan *Worker, math.MaxInt16),
		logger:    logger.With(zap.String("channel", "worker-pool")),
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

// handle запускает обработку воркеров
func (p *Pool) handle() {
	for worker := range p.collector {
		p.wg.Add(1)
		go func(worker *Worker) {
			defer p.wg.Done()
			err := worker.run(p.ctx)
			if err != nil {
				p.logger.Error("failed to run task", zap.Error(err))
			}
		}(worker)
	}
	close(p.done)
}

// AddTask добавляет воркер в пул
func (p *Pool) AddTask(worker *Worker) {
	if p.closed.Load() {
		p.logger.Error("failed to add task")
	}

	p.collector <- worker
}

// Wait ожидает выполнения всех воркеров в пуле
func (p *Pool) Wait() {
	<-p.done
	p.wg.Wait()
}
