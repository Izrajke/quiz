package domain

type Player struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Points int    `json:"points"`
}

type PlayersMessage struct {
	Type    int       `json:"type"`
	Players []*Player `json:"players"`
}
