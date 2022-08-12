import type { RootStore } from 'store/RootStore';

import { makeObservable } from 'mobx';


import { HomeSocketResponseController } from './HomeSocketResponseController';
import type { HomeSocketRequest } from './types';

export class HomeSocket {
  /** Root store */
  root: RootStore;
  private name = 'HomeSocket';
  private url = 'ws://127.0.0.1:8080/ws';
  private socket: WebSocket | undefined;

  controller: HomeSocketResponseController;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      // action
    });
    this.root = root;
    this.controller = new HomeSocketResponseController(this, this.root.home);
  }

  connect = () => {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (evt: MessageEvent) => {
      const data = JSON.parse(evt.data);
      this.root.sockets.socketActionRegister('received', data);
      this.controller.control(data);
    };

    this.socket.onclose = () => {
      console.log('Сокет закрылся');
    };

    this.socket.onerror = () => {
      this.root.sockets.connectionError(this.name);
    };
  };

  disconnect = () => {
    if (this.socket) {
      this.socket.close();
    }
  };

  /** Отправить сообщение сокету */
  send(body: HomeSocketRequest) {
    if (this.socket) {
      this.socket.send(JSON.stringify(body));
      this.root.sockets.socketActionRegister('sent', body);
    }
  }
}
