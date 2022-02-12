import { makeObservable, flow, observable, action } from 'mobx';

import { RootStore } from '../RootStore';
import { DialogProps } from 'components';

import { withDelay } from 'utils';

import { SocketResponseType } from 'api';
import type { SocketAction, SocketLog, SocketSendingType } from 'api';

const answerDelay = 2000;

export class AppStore {
  /** Root store */
  root: RootStore;
  /** Статус инициализации */
  isInit = false;
  /** Ссылка на созданную комнату */
  roomId = '4d325b51-8dfe-4be2-ba97-b636ba2243d8';
  /** Сокет */
  socket: WebSocket | undefined;
  /** Массив сообщений сокета */
  socketLog: SocketLog = [];
  /** Модальные окна */
  dialogs: DialogProps[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isInit: observable,
      roomId: observable,
      socket: observable,
      socketLog: observable,
      dialogs: observable,
      // action
      init: action,
      socketActionRegister: action,
      socketMessage: action,
      setDialog: action,
      removeDialog: action,
      // flow
      socketConnection: flow,
    });
    this.root = root;
  }

  *socketConnection() {
    this.socket = yield new WebSocket(
      `ws://127.0.0.1:8080/ws?room=${this.roomId}&name=${this.root.player.nickname}`,
    );
    if (this.socket) {
      this.socket.onmessage = (evt) => {
        const data = JSON.parse(evt.data);

        this.socketActionRegister('received', data);
        switch (data.type) {
          case SocketResponseType.answerFirstQuestionType:
          case SocketResponseType.answerSecondQuestionType:
            this.root.room.setAnswer(data);
            withDelay(this.root.room.useQuetionModal, answerDelay, [false]);
            break;
          case SocketResponseType.firstQuestionType:
          case SocketResponseType.secondQuestionType:
            this.root.room.setQuestion(data);
            this.root.room.resetAnswer();
            this.root.room.useQuetionModal(true);
            break;
          case SocketResponseType.playersInfo:
            this.root.room.setPlayers(data);
            this.root.player.setPlayerInfo();
            break;
          case SocketResponseType.mapInfo:
            this.root.room.setMap(data);
            break;
          case SocketResponseType.endGame:
            this.root.room.setType(SocketResponseType.endGame);
            break;
          default:
        }
      };
      this.socket.onclose = () => {
        console.log('Сокет закрылся');
      };
    }
  }

  /** Инициальзация приложения */
  init() {
    this.isInit = true;
  }

  /** Отправить сообщение сокету */
  socketMessage = (body: SocketAction) => {
    this.socket && this.socket.send(JSON.stringify(body));
    this.socketActionRegister('sent', body);
  };

  /** Добавляет и запоминает сокет-событие */
  socketActionRegister(type: SocketSendingType, body: SocketAction) {
    this.socketLog.push([type, body]);
  }

  setDialog(dialog: DialogProps) {
    this.dialogs.push(dialog);
  }

  removeDialog = () => {
    this.dialogs.shift();
  };
}
