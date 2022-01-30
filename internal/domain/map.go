package domain

// Cell Ячейка
type Cell struct {
	IsExists bool   `json:"isExists"`
	Owner    string `json:"owner"`
}

// Map Карта
type Map struct {
	Type int       `json:"type"`
	Map  [][]*Cell `json:"map"`
}

// MessageMap3 Карта для 3х игроков
var MessageMap3 = &Map{
	Type: 13,
	Map: [][]*Cell{
		{ // 1
			{ // 1
				IsExists: false,
				Owner:    "",
			},
			{ // 2
				IsExists: false,
				Owner:    "",
			},
			{ // 3
				IsExists: false,
				Owner:    "",
			},
			{ // 4
				IsExists: false,
				Owner:    "",
			},
			{ // 5
				IsExists: false,
				Owner:    "",
			},
		},
		{ // 2
			{ // 1
				IsExists: false,
				Owner:    "",
			},
			{ // 2
				IsExists: false,
				Owner:    "",
			},
			{ // 3
				IsExists: true,
				Owner:    "empty",
			},
			{ // 4
				IsExists: true,
				Owner:    "player-2",
			},
			{ // 5
				IsExists: true,
				Owner:    "player-2",
			},
		},
		{ // 3
			{ // 1
				IsExists: false,
				Owner:    "",
			},
			{ // 2
				IsExists: true,
				Owner:    "player-1",
			},
			{ // 3
				IsExists: true,
				Owner:    "empty",
			},
			{ // 4
				IsExists: true,
				Owner:    "empty",
			},
			{ // 5
				IsExists: true,
				Owner:    "player-2",
			},
		},
		{ // 4
			{ // 1
				IsExists: true,
				Owner:    "player-1",
			},
			{ // 2
				IsExists: true,
				Owner:    "player-1",
			},
			{ // 3
				IsExists: true,
				Owner:    "empty",
			},
			{ // 4
				IsExists: true,
				Owner:    "empty",
			},
			{ // 5
				IsExists: true,
				Owner:    "player-3",
			},
		},
		{ // 5
			{ // 1
				IsExists: true,
				Owner:    "player-1",
			},
			{ // 2
				IsExists: true,
				Owner:    "empty",
			},
			{ // 3
				IsExists: false,
				Owner:    "",
			},
			{ // 4
				IsExists: true,
				Owner:    "player-3",
			},
			{ // 5
				IsExists: false,
				Owner:    "",
			},
		},
	},
}
