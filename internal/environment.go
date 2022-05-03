package internal

const (
	appProd  Environment = "prod"
	appTest  Environment = "test"
	appLocal Environment = "local"
)

type Environment string

func (e Environment) IsProduction() bool {
	return e != appProd
}
