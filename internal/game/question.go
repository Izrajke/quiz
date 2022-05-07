package game

type answer struct {
	Value string `json:"value"`
}

type firstQuestion struct {
	Title   string            `json:"title"`
	Options map[string]string `json:"options"`
}

var globalFirstQuestions = []FirstQuestionData{
	{
		Question: firstQuestion{
			Title:   "Вопрос 1",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &answer{Value: "1"},
	},
	{
		Question: firstQuestion{
			Title:   "Вопрос 2",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &answer{Value: "2"},
	},
	{
		Question: firstQuestion{
			Title:   "Вопрос 3",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &answer{Value: "3"},
	},
	{
		Question: firstQuestion{
			Title:   "Вопрос 4",
			Options: map[string]string{"1": "Вариант 1", "2": "Вариант 2", "3": "Вариант 3", "4": "Вариант 4"},
		},
		Answer: &answer{Value: "4"},
	},
}

type secondQuestion struct {
	Title string `json:"title"`
}

var globalSecondQuestions = []SecondQuestionData{
	{
		Question: secondQuestion{
			Title: "Вопрос 100 + 1",
		},
		Answer: &answer{Value: "101"},
	},
	{
		Question: secondQuestion{
			Title: "Вопрос 50 - 49",
		},
		Answer: &answer{Value: "1"},
	},
	{
		Question: secondQuestion{
			Title: "Вопрос 1 + 50",
		},
		Answer: &answer{Value: "51"},
	},
	{
		Question: secondQuestion{
			Title: "Вопрос 10 - 5",
		},
		Answer: &answer{Value: "5"},
	},
	{
		Question: secondQuestion{
			Title: "тест",
		},
		Answer: &answer{Value: "1111"},
	},
}
