import { AppStore } from './App';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';
import { DictionariesStore } from './Dictionaries';
import { CreatePackStore } from './CreatePack';
import { LibraryStore } from './Library';
import { HomeStore } from './Home';
import { SocketsStore } from './Sockets';

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
  /** Библиотека паков */
  library: LibraryStore;
  /** Домашняя страница */
  home: HomeStore;
  /** Сокеты */
  sockets: SocketsStore;

  constructor() {
    this.app = new AppStore(this);
    this.player = new PlayerStore(this);
    this.room = new RoomStore(this);
    this.dictionaries = new DictionariesStore(this);
    this.createPack = new CreatePackStore(this);
    this.library = new LibraryStore(this);
    this.home = new HomeStore(this);
    this.sockets = new SocketsStore(this);
  }
}

export const root = new RootStore();
