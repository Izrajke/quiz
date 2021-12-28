import { makeObservable, flow, observable, action } from 'mobx';
import { RootStore } from '../RootStore';
import { RoomState } from 'store/Room';

export class AppStore {
  /** Root store */
  root: RootStore;
  /** Статус инициализации */
  isInit: boolean = false;
  /** Ссылка на созданную комнату */
  roomId: string = '4d325b51-8dfe-4be2-ba97-b636ba2243d8';
  /** Сокет */
  socket: WebSocket | undefined;
  /** Стейт комнаты */
  room: RoomState;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isInit: observable,
      roomId: observable,
      socket: observable,

      // action
      init: action,

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
        this.room.setQuestion(data);
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
}
