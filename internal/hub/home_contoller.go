package hub

import "time"

type homeController struct {
	clients map[*HomeClient]time.Time

	eventBuilder *Builder
	eventSender  *Sender
	gameStorage  *GameStorage
}

func newHomeController(
	eventBuilder *Builder,
	eventSender *Sender,
	gameStorage *GameStorage,
) *homeController {
	return &homeController{
		clients: make(map[*HomeClient]time.Time),

		eventBuilder: eventBuilder,
		eventSender:  eventSender,
		gameStorage:  gameStorage,
	}
}

func (h *homeController) register(client *HomeClient) {
	var eventMessage []byte
	h.clients[client] = time.Time{}

	eventMessage = h.eventBuilder.InitWaitingGames(h.gameStorage.GetAll())
	h.eventSender.sendToHomeAll(h.clients, eventMessage)
}

func (h *homeController) broadcast(message *HomeMessage) {
	var eventMessage []byte
	timeNow := time.Now()
	currentTime := timeNow.Unix()

	if lastMessageTime := h.clients[message.client]; timeNow.Second()-lastMessageTime.Second() > 1 {
		eventMessage = h.eventBuilder.ChatMessage(message.message, message.author, currentTime)
		h.eventSender.sendToHomeAll(h.clients, eventMessage)
	} else {
		spamMessage := "Вы не можете отправлять сообщение чаще чем один раз в секунду!"
		spamAuthor := "Система"
		eventMessage = h.eventBuilder.ChatMessage(spamMessage, spamAuthor, currentTime)
		h.eventSender.sendToHomeOne(message.client, eventMessage)
	}

	h.clients[message.client] = timeNow
}

func (h *homeController) unregister(client *HomeClient) {
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.Send)
	}
}
