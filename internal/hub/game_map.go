package hub

const (
	emptyCell = "empty"
	zeroCells = 0
)

type Cell struct {
	IsExists bool   `json:"isExists"` // TODO change field to simple exist
	Owner    string `json:"owner"`
}

type GameMap struct {
	data     [][]*Cell
	freeCell int
}

func NewGameMap() *GameMap {
	// TODO example hardcode GameMap
	// TODO Завязаться на кол-во игроков
	data := [][]*Cell{
		{ // 0
			{ // 0
				IsExists: true,
				Owner:    "empty",
			},
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

	freeCell := 0
	for _, row := range data {
		for _, cell := range row {
			if cell.Owner == emptyCell {
				freeCell++
			}
		}
	}

	return &GameMap{
		data:     data,
		freeCell: freeCell,
	}
}

func (g *GameMap) ChangeCell(row int, cell int, color string) {
	if g.data[row][cell].Owner == emptyCell {
		g.decreaseFreeCell()
	}

	g.data[row][cell].Owner = color
}

func (g *GameMap) GetFreeCell() int {
	return g.freeCell
}

func (g *GameMap) IsZeroFreeCell() bool {
	return g.freeCell == zeroCells
}

func (g *GameMap) decreaseFreeCell() {
	g.freeCell--
}

func (g *GameMap) IsEndGame() bool {
	firstColor := g.data[0][0].Owner

	for _, row := range g.data {
		for _, cell := range row {
			if cell.Owner != firstColor {
				return false
			}
		}
	}

	return true
}
