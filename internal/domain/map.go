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

var GlobalMap = Map4

var Map4 = [][]*Cell{
	{ // 1
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
		{ // 2
			IsExists: true,
			Owner:    "empty",
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
			Owner:    "empty",
		},
	},
	{ // 2
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
		{ // 2
			IsExists: true,
			Owner:    "empty",
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
			IsExists: true,
			Owner:    "empty",
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
			IsExists: true,
			Owner:    "empty",
		},
		{ // 4
			IsExists: true,
			Owner:    "player-3",
		},
		{ // 5
			IsExists: true,
			Owner:    "empty",
		},
	},
}

var Map3 = [][]*Cell{
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
}

var Map2 = [][]*Cell{
	{ // 2
		{ // 1
			IsExists: false,
			Owner:    "",
		},
		{ // 2
			IsExists: false,
			Owner:    "",
		},
	},
	{ // 2
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
		{ // 2
			IsExists: true,
			Owner:    "empty",
		},
	},
	{ // 3
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
		{ // 2
			IsExists: true,
			Owner:    "empty",
		},
	},
}

// MessageMap Сообщение с картой
var MessageMap = &Map{
	Type: 13,
	Map:  GlobalMap,
}
