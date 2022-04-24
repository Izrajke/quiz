import { AppStore } from './App';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';
import { DictionariesStore } from './Dictionaries';

export class RootStore {
  /** Стор приложения */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  /** Комната */
  room: RoomStore;
  /** Словари */
  dictionaries: DictionariesStore;

  constructor() {
    this.app = new AppStore(this);
    this.player = new PlayerStore(this);
    this.room = new RoomStore(this);
    this.dictionaries = new DictionariesStore(this);
  }
}

export const root = new RootStore();
