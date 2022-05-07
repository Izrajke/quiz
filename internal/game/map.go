package game

// cell Ячейка
type cell struct {
	IsExists bool   `json:"isExists"`
	Owner    string `json:"owner"`
}

var globalMap = map2Test

var map3 = [][]*cell{
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
	{ // 3
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
	{ // 4
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
	{ // 5
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
			IsExists: false,
			Owner:    "",
		},
	},
}

var map2 = [][]*cell{
	{ // 1
		{ // 1
			IsExists: false,
			Owner:    "",
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
		{ // 3
			IsExists: true,
			Owner:    "empty",
		},
		{ // 4
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
		{ // 3
			IsExists: true,
			Owner:    "empty",
		},
		{ // 4
			IsExists: false,
			Owner:    "",
		},
	},
	{ // 4
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
	},
}

var map2Test = [][]*cell{
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
	},
	//{ // 2
	//	{ // 1
	//		IsExists: true,
	//		Owner:    "empty",
	//	},
	//	{ // 2
	//		IsExists: true,
	//		Owner:    "empty",
	//	},
	//	{ // 3
	//		IsExists: true,
	//		Owner:    "empty",
	//	},
	//},
}
