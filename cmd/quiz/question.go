package main

type Answer struct {
	Value int `json:"value"`
}

type Question struct {
	Title   string         `json:"title"`
	Options map[int]string `json:"options"`
}

// FirstQuestion Вопрос первого типа
type FirstQuestion struct {
	Type     int      `json:"type"`
	Question Question `json:"question"`
	Answer   *Answer  `json:"answer,omitempty"`
}

var questions = []FirstQuestion{
	{
		Type: 1,
		Question: Question{
			Title:   "Вопрос 1",
			Options: map[int]string{1: "Вариант 1", 2: "Вариант 2", 3: "Вариант 3", 4: "Вариант 4"},
		},
		Answer: &Answer{Value: 1},
	},
	{
		Type: 1,
		Question: Question{
			Title:   "Вопрос 2",
			Options: map[int]string{1: "Вариант 1", 2: "Вариант 2", 3: "Вариант 3", 4: "Вариант 4"},
		},
		Answer: &Answer{Value: 2},
	},
	{
		Type: 1,
		Question: Question{
			Title:   "Вопрос 3",
			Options: map[int]string{1: "Вариант 1", 2: "Вариант 2", 3: "Вариант 3", 4: "Вариант 4"},
		},
		Answer: &Answer{Value: 3},
	},
	{
		Type: 1,
		Question: Question{
			Title:   "Вопрос 4",
			Options: map[int]string{1: "Вариант 1", 2: "Вариант 2", 3: "Вариант 3", 4: "Вариант 4"},
		},
		Answer: &Answer{Value: 4},
	},
}

// FirstQuestionAnswer Ответ для вопроса первого типа
type FirstQuestionAnswer struct {
	Type   int    `json:"type"`
	Answer Answer `json:"answer"`
}
