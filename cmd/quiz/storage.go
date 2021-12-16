package main

import "sync"

type Cache struct {
	items map[string]Item
	mu    sync.RWMutex
}

type Item struct {
	valid bool
	value string
}

func NewCache() *Cache {
	return &Cache{items: make(map[string]Item)}
}

func (c *Cache) Set(key string, value string) {
	c.mu.Lock()
	c.items[key] = Item{
		valid: true,
		value: value,
	}
	c.mu.Unlock()
}

func (c *Cache) Get(key string) Item {
	c.mu.RLock()

	item, found := c.items[key]
	if !found {
		c.mu.RUnlock()
		return Item{}
	}
	c.mu.RUnlock()
	return item
}

func (c *Cache) Flush() {
	c.mu.Lock()
	c.items = make(map[string]Item)
	c.mu.Unlock()
}
