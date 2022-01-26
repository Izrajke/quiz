package inmemory

import "sync"

type Storage struct {
	items map[string]Item
	mu    sync.RWMutex
}

type Item struct {
	valid bool
	value string
}

func NewStorage() *Storage {
	return &Storage{items: make(map[string]Item)}
}

func (c *Storage) Set(key string, value string) {
	c.mu.Lock()
	c.items[key] = Item{
		valid: true,
		value: value,
	}
	c.mu.Unlock()
}

func (c *Storage) Get(key string) Item {
	c.mu.RLock()

	item, found := c.items[key]
	if !found {
		c.mu.RUnlock()
		return Item{}
	}
	c.mu.RUnlock()
	return item
}

func (c *Storage) Flush() {
	c.mu.Lock()
	c.items = make(map[string]Item)
	c.mu.Unlock()
}
