package api

type shortPack struct {
	Id         int     `json:"id"`
	Title      string  `json:"title"`
	CategoryId int     `json:"categoryId"`
	Rating     float32 `json:"rating"`
}

type rangeQuestion struct {
	Title  string `json:"title"`
	Answer int    `json:"answer"`
}

type multipleChoiceQuestion struct {
	Title   string   `json:"title"`
	Options []string `json:"options"`
	Answer  int      `json:"answer"`
}

type pack struct {
	RangeQuestions          []rangeQuestion          `json:"rangeQuestions"`
	MultipleChoiceQuestions []multipleChoiceQuestion `json:"multipleChoiceQuestions"`
}

type fullPack struct {
	Id         int    `json:"id"`
	CategoryId int    `json:"categoryId"`
	Title      string `json:"title"`
	Pack       pack   `json:"pack"`
}
