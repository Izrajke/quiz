import type { RootStore } from 'store/RootStore';

import { makeObservable, action } from 'mobx';

import { RoomSocketResponseController } from './RoomSocketResponseController';
import type { RoomSocketRequest } from './types';

export class RoomSocket {
  root: RootStore;
  private name = 'RoomSocket';
  private url = 'ws://127.0.0.1:8080/ws';
  private socket: WebSocket | undefined;

  controller: RoomSocketResponseController;

  constructor(root: RootStore) {
    makeObservable(this, {
      /** action */
      connect: action,
    });

    this.root = root;
    this.controller = new RoomSocketResponseController(
      this,
      this.root.room,
      this.root.player,
    );
  }

  connect = (roomId: string) => {
    const searchParams = new URLSearchParams({
      room: roomId,
      name: this.root.player.nickname,
      avatar: window.btoa(JSON.stringify(this.root.player.avatarConfig)),
    }).toString();

    this.socket = new WebSocket(`${this.url}?${searchParams}`);

    this.socket.onmessage = (evt) => {
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
  send(body: RoomSocketRequest) {
    if (this.socket) {
      this.socket.send(JSON.stringify(body));
      this.root.sockets.socketActionRegister('sent', body);
    }
  }
}
