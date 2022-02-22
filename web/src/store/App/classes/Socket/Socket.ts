import { makeObservable, action, observable } from 'mobx';

import { RootStore } from 'store/RootStore';

import type { SocketRequest, SocketSendingType, SocketLog } from 'api';

import { SocketResponseController } from '../index';

export class Socket {
  root: RootStore;
  private socket: WebSocket;
  controller: SocketResponseController;
  log: SocketLog = [];

  constructor(root: RootStore, url: string) {
    makeObservable(this, {
      /** observable */
      log: observable,
      /** action */
      socketActionRegister: action,
    });

    this.root = root;
    this.socket = new WebSocket(url);
    this.controller = new SocketResponseController(
      this,
      this.root.room,
      this.root.player,
    );

    this.socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      this.socketActionRegister('received', data);
      this.controller.control(data);
    };

    this.socket.onclose = () => {
      console.log('Сокет закрылся');
    };
  }

  /** Отправить сообщение сокету */
  send(body: SocketRequest) {
    this.socket.send(JSON.stringify(body));
    this.socketActionRegister('sent', body);
  }

  /** Добавляет и запоминает сокет-событие */
  socketActionRegister(type: SocketSendingType, body: SocketRequest) {
    this.log.push([type, body]);
  }
}
