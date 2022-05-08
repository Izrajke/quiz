import type { HomeStore } from 'store';
import type { HomeSocket } from '../HomeSocket';

import { HomeSocketResponseType, HomeSocketResponse } from '../types';

export class HomeSocketResponseController {
  socket: HomeSocket;
  home: HomeStore;

  constructor(socket: HomeSocket, home: HomeStore) {
    this.socket = socket;
    this.home = home;
  }

  control(data: HomeSocketResponse) {
    switch (data.type) {
      case HomeSocketResponseType.chatMessage:
        this.home.setMessage(data);
        break;
      default:
        console.log('Неизвестный SocketResponseType');
    }
  }
}
