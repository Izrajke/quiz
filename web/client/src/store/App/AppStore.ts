import { makeObservable, flow, observable, action } from 'mobx';
import { RootStore } from '../RootStore';
import { RoomState } from 'store/Room';
import { TSocketResponseType } from 'api';
import type { TSocketAction, TSocketLog, TSocketSendingType } from 'api';

export class AppStore {
  /** Root store */
  root: RootStore;
  /** Статус инициализации */
  isInit = false;
  /** Ссылка на созданную комнату */
  roomId = '4d325b51-8dfe-4be2-ba97-b636ba2243d8';
  /** Сокет */
  socket: WebSocket | undefined;
  /** Стейт комнаты */
  room: RoomState;
  /** Массив сообщений сокета */
  socketLog: TSocketLog = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isInit: observable,
      roomId: observable,
      socket: observable,
      socketLog: observable,
      // action
      init: action,
      socketActionRegister: action,
      socketMessage: action,
      // flow
      socketConnection: flow,
    });
    this.root = root;
    this.room = new RoomState(root);
  }

  *socketConnection() {
    this.socket = yield new WebSocket(
      'ws://127.0.0.1:8080/ws?room=' + this.roomId,
    );
    if (this.socket) {
      this.socket.onmessage = (evt) => {
        const data = JSON.parse(evt.data);

        this.socketActionRegister('received', data);
        console.log(this.socketLog);
        switch (data.type) {
          case TSocketResponseType.answerFirstQuestionType:
          case TSocketResponseType.answerSecondQuestionType:
            this.room.setAnswer(data);
            break;
          case TSocketResponseType.firstQuestionType:
          case TSocketResponseType.secondQuestionType:
            this.room.setQuestion(data);
            break;
          default:
            break;
        }
      };
      this.socket.onclose = () => {
        console.log('Сокет закрылся');
      };
    }
  }

  /** Инициальзация приложение */
  init() {
    this.isInit = true;
  }

  /** Отправить сообщение сокету */
  socketMessage(body: any) {
    this.socket && this.socket.send(JSON.stringify(body));
    this.socketActionRegister('sent', body);
  }

  /** Добавляет и запоминает сокет-событие */
  socketActionRegister(type: TSocketSendingType, body: TSocketAction) {
    this.socketLog.push([type, body]);
  }
}
