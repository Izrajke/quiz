import { AppStore } from './App';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';

export class RootStore {
  /** Стор приложения */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  /** Комната */
  room: RoomStore;
  constructor() {
    this.app = new AppStore(this);
    this.player = new PlayerStore(this);
    this.room = new RoomStore(this);
  }
}

export const root = new RootStore();
