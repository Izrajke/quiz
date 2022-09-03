package hub

const (
	// Take получить территорию
	Take state = 1
	// Attack атаковать территорию
	Attack state = 2
)

type state int

type GameState struct {
	state state
	wait  bool
}

func NewGameState() *GameState {
	return &GameState{
		state: Take,
		wait:  true,
	}
}

func (g *GameState) IsTake() bool {
	return g.state == Take
}

func (g *GameState) IsAttack() bool {
	return g.state == Attack
}

func (g *GameState) ChangeStateToTake() {
	g.state = Take
}

func (g *GameState) ChangeStateToAttack() {
	g.state = Attack
}

func (g *GameState) EnableWait() {
	g.wait = true
}

func (g *GameState) DisableWait() {
	g.wait = false
}

func (g *GameState) IsWait() bool {
	return g.wait
}
