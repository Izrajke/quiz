package game

type Answer struct {
	Value string `json:"value"`
}

type FirstQuestion struct {
	Title   string            `json:"title"`
	Options map[string]string `json:"options"`
}

var GlobalFirstQuestions = []FirstQuestionData{
	{
		Question: FirstQuestion{
			Title:   "Вопрос 1",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "1"},
	},
	{
		Question: FirstQuestion{
			Title:   "Вопрос 2",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "2"},
	},
	{
		Question: FirstQuestion{
			Title:   "Вопрос 3",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "3"},
	},
	{
		Question: FirstQuestion{
			Title:   "Вопрос 4",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &Answer{Value: "4"},
	},
}

type SecondQuestion struct {
	Title string `json:"title"`
}

var GlobalSecondQuestions = []SecondQuestionData{
	{
		Question: SecondQuestion{
			Title: "Вопрос 100 + 1",
		},
		Answer: &Answer{Value: "101"},
	},
	{
		Question: SecondQuestion{
			Title: "Вопрос 50 - 49",
		},
		Answer: &Answer{Value: "1"},
	},
	{
		Question: SecondQuestion{
			Title: "Вопрос 1 + 50",
		},
		Answer: &Answer{Value: "51"},
	},
	{
		Question: SecondQuestion{
			Title: "Вопрос 10 - 5",
		},
		Answer: &Answer{Value: "5"},
	},
	{
		Question: SecondQuestion{
			Title: "тест",
		},
		Answer: &Answer{Value: "1111"},
	},
}
