import { makeObservable, flow, observable, action } from 'mobx';

import type { RootStore } from 'store';
import type { DialogProps } from 'components';

import type { SocketRequest } from 'api';

import { Socket } from './classes';

export class AppStore {
  /** Root store */
  root: RootStore;
  /** Статус инициализации */
  isInit = false;
  /** Ссылка на созданную комнату */
  roomId = '';
  /** Сокет */
  socket: Socket | undefined;
  /** Модальные окна */
  dialogs: DialogProps[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isInit: observable,
      roomId: observable,
      socket: observable,
      dialogs: observable,
      // action
      init: action,
      socketMessage: action,
      setDialog: action,
      removeDialog: action,
      setRoomId: action,
      // flow
      socketConnection: flow,
    });
    this.root = root;
  }

  *socketConnection(id: string) {
    const searchParams = new URLSearchParams({
      room: id,
      name: this.root.player.nickname,
    }).toString();
    // TODO: Возможно сокетов будет несколько. Их нужно будет тогда разбить roomSocket, homeSocket и т.п
    this.socket = yield new Socket(
      this.root,
      `ws://127.0.0.1:8080/ws?${searchParams}`,
    );
  }

  /** Инициальзация приложения */
  init() {
    this.isInit = true;
  }

  /** Отправить сообщение сокету */
  socketMessage = (body: SocketRequest) => {
    this.socket && this.socket.send(body);
  };

  setDialog(dialog: DialogProps) {
    this.dialogs.push(dialog);
  }

  removeDialog = () => {
    this.dialogs.shift();
  };

  setRoomId = (newId: string) => {
    this.roomId = newId;
  };
}
