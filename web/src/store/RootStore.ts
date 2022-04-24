import { AppStore } from './App';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';
import { DictionariesStore } from './Dictionaries';
import { CreatePackStore } from './CreatePack';

export class RootStore {
  /** Стор приложения */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  /** Комната */
  room: RoomStore;
  /** Словари */
  dictionaries: DictionariesStore;
  /** Страница создания/просмотра пака */
  createPack: CreatePackStore;

  constructor() {
    this.app = new AppStore(this);
    this.player = new PlayerStore(this);
    this.room = new RoomStore(this);
    this.dictionaries = new DictionariesStore(this);
    this.createPack = new CreatePackStore(this);
  }
}

export const root = new RootStore();
