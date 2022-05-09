export enum HomeSocketResponseType {
  /** Сообщение из чата */
  chatMessage = 100,
}

export enum HomeSocketRequestType {
  /** Отправить сообщение */
  sendMessage = 10,
}

export interface HomeSocketMessage {
  uuid: string;
  type: HomeSocketResponseType;
  author: string;
  message: string;
  time: number;
}

export interface HomeSocketSendMessage {
  type: HomeSocketRequestType.sendMessage;
  message: string;
}

export interface HomeSocketPlayer {
  id: string;
  name: string;
  avatar: string;
}

export interface HomeSocketLobbyCard {
  id: string;
  maximumOfPlayers: number;
  name: string;
  type: string;
  players: HomeSocketPlayer[];
}

export type HomeSocketResponse = HomeSocketMessage | HomeSocketLobbyCard;

export type HomeSocketRequest = HomeSocketSendMessage;
