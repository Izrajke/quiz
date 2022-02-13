package domain

type Question struct {
	Title   string            `json:"title"`
	Options map[string]string `json:"options"`
}

var GlobalQuestions = []FirstQuestionInfo{
	{
		Question: Question{
			Title:   "Вопрос 1",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "1"},
	},
	{
		Question: Question{
			Title:   "Вопрос 2",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "2"},
	},
	{
		Question: Question{
			Title:   "Вопрос 3",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "3"},
	},
	{
		Question: Question{
			Title:   "Вопрос 4",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "4"},
	},
}
