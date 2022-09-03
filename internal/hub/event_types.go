package hub

const (
	// вопрос с выбором
	choiceQuestion = 1
	// вопрос с диапазоном
	rangeQuestion = 2

	// ответ на вопрос первого типа
	eventAnswerFirstQuestionType = 5
	// ответ на вопрос второго типа
	eventAnswerSecondQuestionType = 6
	// информация о получении клетки
	eventSelectCellType = 7

	// ходы для захвата (для отрисовки порядка ходов)
	movesToCapture = 8
	// ходы для атаки (для отрисовки порядка ходов)
	movesToAttack = 9

	// инициализация раунда
	initRound = 10
	// инициализация игроков
	initPlayers = 12
	// инициализация карты
	initMap = 13

	// сообщение из чата
	eventChatMessageType = 100
	// инициализация ожидающих игр
	initWaitingGames = 101

	// конец игры
	endGame = 999
)
