export enum HomeSocketResponseType {
  /** Сообщение из чата */
  chatMessage = 100,
  /** Созданные лобби */
  lobbys = 101,
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
  author: string;
}

export interface HomeSocketPlayer {
  id: string;
  name: string;
  avatar: string;
}

export interface HomeSocketLobbyCard {
  id: string;
  max: number;
  pack: string;
  subject: string;
  players: HomeSocketPlayer[];
}

export interface HomeSocketCreatedLobbies {
  type: HomeSocketResponseType;
  rooms: HomeSocketLobbyCard[];
}

export type HomeSocketResponse = HomeSocketMessage & HomeSocketCreatedLobbies;

export type HomeSocketRequest = HomeSocketSendMessage;
