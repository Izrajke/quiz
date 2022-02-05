import { makeObservable, flow, observable, action } from 'mobx';

import { RootStore } from '../RootStore';
import { RoomState } from 'store/Room';
import { DialogProps } from 'components';

import { withDelay } from 'utils';

import { TSocketResponseType, TSocketRequestType } from 'api';
import type { TSocketAction, TSocketLog, TSocketSendingType } from 'api';

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
  /** Стейт комнаты */
  room: RoomState;
  /** Массив сообщений сокета */
  socketLog: TSocketLog = [];
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
    this.room = new RoomState(root);
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
          case TSocketResponseType.answerFirstQuestionType:
          case TSocketResponseType.answerSecondQuestionType:
            this.room.setAnswer(data);
            withDelay(this.room.useQuetionModal, answerDelay, [false]);
            // TODO: После выбора территории автоматически отправить вопрос с сервера?
            break;
          case TSocketResponseType.firstQuestionType:
          case TSocketResponseType.secondQuestionType:
            this.room.setQuestion(data);
            this.room.resetAnswer();
            this.room.useQuetionModal(true);
            break;
          case TSocketResponseType.playersInfo:
            console.log('playes info', data);
            this.room.setPlayers(data);
            this.root.player.setPlayerInfo();
            break;
          case TSocketResponseType.mapInfo:
            this.room.setMap(data);
            withDelay(this.socketMessage, answerDelay, [
              { type: TSocketRequestType.getQuestion },
            ]);
            break;
          case TSocketResponseType.endGame:
            this.room.setType(TSocketResponseType.endGame);
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
  socketMessage = (body: any) => {
    this.socket && this.socket.send(JSON.stringify(body));
    this.socketActionRegister('sent', body);
  };

  /** Добавляет и запоминает сокет-событие */
  socketActionRegister(type: TSocketSendingType, body: TSocketAction) {
    this.socketLog.push([type, body]);
  }

  setDialog(dialog: DialogProps) {
    this.dialogs.push(dialog);
  }

  removeDialog = () => {
    this.dialogs.shift();
  };
}
