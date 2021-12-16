package main

type question struct {
	Type    int      `json:"type"`
	Title   string   `json:"question"`
	Options []string `json:"options"`
}

var questions = []*question{
	{
		Type:    1,
		Title:   "Вопрос 1",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
	{
		Type:    1,
		Title:   "Вопрос 2",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
	{
		Type:    1,
		Title:   "Вопрос 3",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
	{
		Type:    1,
		Title:   "Вопрос 4",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
	{
		Type:    1,
		Title:   "Вопрос 5",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
	{
		Type:    1,
		Title:   "Вопрос 6",
		Options: []string{"Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"},
	},
}
