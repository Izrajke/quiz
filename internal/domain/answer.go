package domain

type Answer struct {
	Value string `json:"value"`
}

// FirstQuestionAnswer Ответ для вопроса первого типа
type FirstQuestionAnswer struct {
	Type   int    `json:"type"`
	Answer Answer `json:"answer"`
}
