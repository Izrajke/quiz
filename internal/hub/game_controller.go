package hub

import (
	"context"
	"math"
	"math/rand"
	"quiz/internal/workerpool"
	"sort"
	"time"
)

type gameController struct {
	eventBuilder *Builder
	eventSender  *Sender
	gameStorage  *GameStorage
	workerPool   *workerpool.Pool
}

func newGameController(
	eventBuilder *Builder,
	eventSender *Sender,
	gameStorage *GameStorage,
	workerPool *workerpool.Pool,
) *gameController {
	return &gameController{
		eventBuilder: eventBuilder,
		eventSender:  eventSender,
		gameStorage:  gameStorage,
		workerPool:   workerPool,
	}
}

// Register new connection registration
func (g *gameController) Register(subscription *Subscription, homeClients map[*HomeClient]time.Time) {
	game, found := g.gameStorage.Get(subscription.GameID)
	if !found {
		return
	}
	game.AddPlayer(subscription.Conn, subscription.Player)

	eventQueueSlice := make([]*eventQueue, 0)
	eventQueueSlice = append(eventQueueSlice, []*eventQueue{
		{
			eventMessage:   g.eventBuilder.InitWaitingGames(g.gameStorage.GetAll()),
			eventType:      eventTypeHomeAll,
			homeAllClients: homeClients,
		},
		{
			eventMessage:   g.eventBuilder.InitPlayers(game.Players),
			eventType:      eventTypeGameAll,
			gameAllClients: game.Players,
		},
		{
			eventMessage:  g.eventBuilder.InitMap(game.Map.data),
			eventType:     eventTypeGameOne,
			gameOneClient: subscription.Conn,
		},
	}...)

	if game.IsFullPlayers() {
		eventQueueSlice = append(eventQueueSlice, []*eventQueue{
			{
				eventMessage:   g.eventBuilder.MovesToCapture(4),
				eventType:      eventTypeGameAll,
				gameAllClients: game.Players,
			},
			{
				eventMessage:   g.eventBuilder.InitRound(game.GetRound()),
				eventType:      eventTypeGameAll,
				gameAllClients: game.Players,
			},
			{
				eventMessage:   g.eventBuilder.RangeQuestion(game.FullPackage.Pack.RangeQuestions[game.rangeQuestion]),
				eventType:      eventTypeGameAll,
				gameAllClients: game.Players,
			},
		}...)

		game.Start()
	}

	g.eventSender.SwitchToSendAll(eventQueueSlice)
}

// Broadcast обрабатывает сообщение
func (g *gameController) Broadcast(message *Message) {
	var eventMessage []byte
	game, found := g.gameStorage.Get(message.Room)
	if !found {
		return
	}

	if game.State.IsWait() {
		if game.State.IsTake() {
			game.PlayersAnswers[message.PlayerID] = &PlayerAnswer{
				Color: message.PlayerColor,
				Name:  message.PlayerName,
				Value: message.Request.AnswerInt,
				Time:  math.Round(message.Time.Sub(game.questionStartedAt).Seconds()*100) / 100,
			}

			if len(game.PlayersAnswers) == game.Settings.PlayerCount {
				correctAnswer := game.FullPackage.Pack.RangeQuestions[game.rangeQuestion].Answer

				eventMessage = g.eventBuilder.AnswerSecondQuestion(game.PlayersAnswers, correctAnswer)
				g.eventSender.sendToGameAll(game.Players, eventMessage)

				// подсчет кто ближе ответил Player1: 1945, Player2: 1933, правильный ответ 1965
				playerAnswerSlice := make([]*PlayerAnswer, 0, len(game.PlayersAnswers))
				for _, playerAnswer := range game.PlayersAnswers {
					playerAnswerSlice = append(playerAnswerSlice, &PlayerAnswer{
						Color: playerAnswer.Color,
						Value: int(math.Abs(float64(playerAnswer.Value - correctAnswer))),
						Time:  playerAnswer.Time,
					})
				}
				sort.Slice(playerAnswerSlice, func(i, j int) bool {
					if playerAnswerSlice[j].Value == playerAnswerSlice[i].Value {
						return playerAnswerSlice[j].Time < playerAnswerSlice[i].Time
					}
					return playerAnswerSlice[j].Value < playerAnswerSlice[i].Value
				})
				minTakeCell := 1
				for _, playerAnswer := range playerAnswerSlice {
					game.PlayersTakeCell = append(game.PlayersTakeCell, &TakeCell{
						Count: minTakeCell,
						Color: playerAnswer.Color,
					})
					minTakeCell++
				}

				firstTakeCellPlayer := game.PlayersTakeCell[len(game.PlayersTakeCell)-1]
				game.State.ChangeStateToTake()
				game.State.DisableWait()

				g.workerPool.AddTask(workerpool.NewTask(func(context.Context) {
					time.Sleep(5 * time.Second)

					eventMessage = g.eventBuilder.SelectCell(firstTakeCellPlayer.Color, firstTakeCellPlayer.Count)
					g.eventSender.sendToGameAll(game.Players, eventMessage)
				}))
			}
			return
		}

		if game.State.IsAttack() {
			game.PlayersAnswers[message.PlayerID] = &PlayerAnswer{
				Color: message.PlayerColor,
				Name:  message.PlayerName,
				Value: message.Request.AnswerInt,
				Time:  math.Round(message.Time.Sub(game.questionStartedAt).Seconds()*100) / 100,
			}

			if len(game.PlayersAnswers) == game.Settings.PlayerCount {
				correctAnswer := game.FullPackage.Pack.RangeQuestions[game.choiceQuestion].Answer

				var winPlayer string
				for _, answer := range game.PlayersAnswers {
					if answer.Value == correctAnswer {
						winPlayer = answer.Color
						break
					}
				}

				game.PlayersAnswers = make(map[string]*PlayerAnswer) // TODO set

				eventMessage = g.eventBuilder.AnswerFirstQuestion(correctAnswer)
				g.eventSender.sendToGameAll(game.Players, eventMessage)

				game.IncRound()
				if winPlayer != "" {
					game.Map.ChangeCell(game.RowIndex, game.CellIndex, winPlayer)
				} else {
					winPlayer = game.moves[game.GetRound()-1]
				}
				game.State.DisableWait()

				if !game.Map.IsEndGame() {
					g.workerPool.AddTask(workerpool.NewTask(func(context.Context) {
						time.Sleep(2 * time.Second)

						eventMessage = g.eventBuilder.InitMap(game.Map.data)
						g.eventSender.sendToGameAll(game.Players, eventMessage)

						eventMessage = g.eventBuilder.InitRound(game.GetRound())
						g.eventSender.sendToGameAll(game.Players, eventMessage)
					}))

					g.workerPool.AddTask(workerpool.NewTask(func(context.Context) {
						time.Sleep(4 * time.Second)

						eventMessage = g.eventBuilder.SelectCell(winPlayer, 1)
						g.eventSender.sendToGameAll(game.Players, eventMessage)
					}))
				} else {
					g.workerPool.AddTask(workerpool.NewTask(func(context.Context) {
						time.Sleep(2 * time.Second)

						eventMessage = g.eventBuilder.InitMap(game.Map.data)
						g.eventSender.sendToGameAll(game.Players, eventMessage)
					}))

					g.workerPool.AddTask(workerpool.NewTask(func(context.Context) {
						time.Sleep(4 * time.Second)

						eventMessage = g.eventBuilder.EndGame()
						g.eventSender.sendToGameAll(game.Players, eventMessage)
					}))
				}
			}
			return
		}
		return
	}

	if game.State.IsTake() {
		game.Map.ChangeCell(message.Request.RowIndex, message.Request.CellIndex, message.PlayerColor)

		eventMessage = g.eventBuilder.InitMap(game.Map.data)
		g.eventSender.sendToGameAll(game.Players, eventMessage)

		firstTakeCellPlayer := game.PlayersTakeCell[len(game.PlayersTakeCell)-1]
		firstTakeCellPlayer.Count--

		if firstTakeCellPlayer.Count == 0 {
			game.PlayersTakeCell = game.PlayersTakeCell[:len(game.PlayersTakeCell)-1]
		}

		if len(game.PlayersTakeCell) != 0 {
			firstTakeCellPlayer = game.PlayersTakeCell[len(game.PlayersTakeCell)-1]
			eventMessage = g.eventBuilder.SelectCell(firstTakeCellPlayer.Color, firstTakeCellPlayer.Count)
			g.eventSender.sendToGameAll(game.Players, eventMessage)
		} else {
			game.IncRound()

			if !game.Map.IsZeroFreeCell() {
				time.Sleep(2 * time.Second)

				eventMessage = g.eventBuilder.InitRound(game.GetRound())
				g.eventSender.sendToGameAll(game.Players, eventMessage)
				eventMessage = g.eventBuilder.RangeQuestion(game.FullPackage.Pack.RangeQuestions[game.rangeQuestion])
				g.eventSender.sendToGameAll(game.Players, eventMessage)
				game.rangeQuestion++

				game.State.EnableWait()
			} else {
				game.PlayersAnswers = make(map[string]*PlayerAnswer)

				colors := make([]string, 0)
				for _, player := range game.Players {
					colors = append(colors, player.Color)
				}
				moves := make([]string, 0)
				rand.Seed(time.Now().Unix())
				for i := 0; i < 5; i++ {
					rand.Shuffle(len(colors), func(i, j int) {
						colors[i], colors[j] = colors[j], colors[i]
					})
					for _, color := range colors {
						moves = append(moves, color)
					}
				}

				game.SetMoves(moves)
				game.ResetRound()
				eventMessage = g.eventBuilder.NumberOfMovesForAttack(moves)
				g.eventSender.sendToGameAll(game.Players, eventMessage)

				eventMessage = g.eventBuilder.SelectCell(game.moves[game.GetRound()-1], 1)
				g.eventSender.sendToGameAll(game.Players, eventMessage)

				game.State.ChangeStateToAttack()
				game.State.DisableWait()
			}
		}
		return
	}

	if game.State.IsAttack() {
		game.RowIndex = message.Request.RowIndex
		game.CellIndex = message.Request.CellIndex

		eventMessage = g.eventBuilder.ChoiceQuestion(game.FullPackage.Pack.ChoiceQuestions[game.choiceQuestion])
		g.eventSender.sendToGameAll(game.Players, eventMessage)
		game.choiceQuestion++

		game.State.EnableWait()
		return
	}
}

func (g *gameController) Unregister(s Subscription) {
	game, found := g.gameStorage.Get(s.GameID)
	if !found {
		return
	}

	game.playerColors[s.Player.Color] = struct{}{}
	delete(game.Players, s.Conn) // TODO to storage
	close(s.Conn.Send)

	if len(game.Players) == 0 {
		g.gameStorage.Delete(s.GameID)
	}
}
