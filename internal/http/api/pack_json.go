package api

type shortPack struct {
	Id         int     `json:"id"`
	CategoryId int     `json:"categoryId" db:"categoryid"`
	Title      string  `json:"title"`
	Rating     float32 `json:"rating"`
}

type RangeQuestion struct {
	Title  string `json:"title"`
	Answer int    `json:"answer"`
}

type MultipleChoiceQuestion struct {
	Title   string   `json:"title"`
	Options []string `json:"options"`
	Answer  int      `json:"answer"`
}

type pack struct {
	RangeQuestions  []RangeQuestion          `json:"rangeQuestions"`
	ChoiceQuestions []MultipleChoiceQuestion `json:"multipleChoiceQuestions"`
}

type FullPack struct {
	Id         int    `json:"id"`
	CategoryId int    `json:"categoryId" `
	Title      string `json:"title"`
	Pack       pack   `json:"pack" db:"data"`
}
