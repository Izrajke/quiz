import { makeObservable } from 'mobx';

import type { RootStore } from 'store/RootStore';
import { RoomSocketRequest } from 'store/Sockets/RoomSocket/types';

export class HomeSocket {
  /** Root store */
  root: RootStore;
  private name = 'HomeSocket';
  private url = 'ws://127.0.0.1:8080/ws';
  private socket: WebSocket | undefined;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      // action
    });
    this.root = root;
  }

  connect = () => {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      this.root.sockets.socketActionRegister('sent', data);
    };

    this.socket.onclose = () => {
      console.log('Сокет закрылся');
    };

    this.socket.onerror = () => {
      this.root.sockets.connectionError(this.name);
    };
  };

  /** Отправить сообщение сокету */
  send(body: RoomSocketRequest) {
    if (this.socket) {
      this.socket.send(JSON.stringify(body));
      this.root.sockets.socketActionRegister('sent', body);
    }
  }
}
