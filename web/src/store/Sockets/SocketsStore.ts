import { toast } from 'react-toastify';
import { SocketLog, SocketSendingType } from 'store/Sockets';

import { action, makeObservable, observable } from 'mobx';


import type { RootStore } from '../RootStore';

import { HomeSocket } from './HomeSocket';
import type { HomeSocketRequest } from './HomeSocket';
import { RoomSocket } from './RoomSocket';
import type { RoomSocketRequest } from './RoomSocket';


export class SocketsStore {
  /** Root store */
  root: RootStore;
  /** Сокет игровой комнаты */
  roomSocket: RoomSocket;
  /** Сокет главной страницы */
  homeSocket: HomeSocket;

  log: SocketLog = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      roomSocket: observable,
      homeSocket: observable,
      log: observable,
      // action
      socketActionRegister: action,
    });
    this.root = root;
    this.roomSocket = new RoomSocket(root);
    this.homeSocket = new HomeSocket(root);
  }

  socketActionRegister(
    type: SocketSendingType,
    body: RoomSocketRequest | HomeSocketRequest,
  ) {
    this.log.push([type, body]);
  }

  connectionError = (socketName: string) => {
    const message = `Нет подключения к сокету ${socketName}`;

    console.error(message);
    toast.error(message);
  };
}
