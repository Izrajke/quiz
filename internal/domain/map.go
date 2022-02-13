package domain

// Cell Ячейка
type Cell struct {
	IsExists bool   `json:"isExists"`
	Owner    string `json:"owner"`
}

var GlobalMap = Map2

var Map5 = [][]*Cell{
	{ // 2
		{ // 1
			IsExists: true,
			Owner:    "player-2",
		},
		{ // 2
			IsExists: true,
			Owner:    "player-2",
		},
	},
	{ // 2
		{ // 1
			IsExists: true,
			Owner:    "player-1",
		},
		{ // 2
			IsExists: true,
			Owner:    "player-1",
		},
	},
	{ // 3
		{ // 1
			IsExists: true,
			Owner:    "player-3",
		},
		{ // 2
			IsExists: true,
			Owner:    "player-3",
		},
	},
}

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
	{ // 0
		{ // 0
			IsExists: false,
			Owner:    "",
		},
		{ // 1
			IsExists: false,
			Owner:    "",
		},
	},
	{ // 1
		{ // 0
			IsExists: true,
			Owner:    "empty",
		},
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
	},
	{ // 2
		{ // 0
			IsExists: true,
			Owner:    "empty",
		},
		{ // 1
			IsExists: true,
			Owner:    "empty",
		},
	},
}
