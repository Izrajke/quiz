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

export type HomeSocketResponse = HomeSocketMessage;

export type HomeSocketRequest = HomeSocketSendMessage;
