package hub

import "time"

type eventType int

const (
	eventTypeGameOne eventType = 1
	eventTypeGameAll eventType = 2
	eventTypeHomeOne eventType = 3
	eventTypeHomeAll eventType = 4
)

type eventQueue struct {
	eventMessage []byte
	eventType    eventType

	gameOneClient  *Connection
	gameAllClients map[*Connection]*Player
	homeOneClient  *HomeClient
	homeAllClients map[*HomeClient]time.Time
}

type Sender struct {
}

func NewSender() *Sender {
	return &Sender{}
}

func (s *Sender) SwitchToSendAll(eventQueue []*eventQueue) {
	for _, event := range eventQueue {
		switch event.eventType {
		case eventTypeGameOne:
			s.sendToGameOne(event.gameOneClient, event.eventMessage)
		case eventTypeGameAll:
			s.sendToGameAll(event.gameAllClients, event.eventMessage)
		case eventTypeHomeOne:
			s.sendToHomeOne(event.homeOneClient, event.eventMessage)
		case eventTypeHomeAll:
			s.sendToHomeAll(event.homeAllClients, event.eventMessage)
		}
	}
}

func (s *Sender) sendToGameOne(c *Connection, message []byte) {
	select {
	case c.Send <- message:
	default:
		// TODO
	}
}

func (s *Sender) sendToGameAll(clients map[*Connection]*Player, message []byte) {
	for client := range clients {
		s.sendToGameOne(client, message)
	}
}

func (s *Sender) sendToHomeOne(client *HomeClient, message []byte) {
	select {
	case client.Send <- message:
	default:
		// TODO
	}
}

func (s *Sender) sendToHomeAll(clients map[*HomeClient]time.Time, message []byte) {
	for client := range clients {
		select {
		case client.Send <- message:
		default:
			// TODO
		}
	}
}
