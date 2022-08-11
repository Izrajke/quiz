import { useContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AppStore } from './App';
import { CreatePackStore } from './CreatePack';
import { DictionariesStore } from './Dictionaries';
import { HomeStore } from './Home';
import { LibraryStore } from './Library';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';
import { RootStore, root } from './RootStore';
import { SocketsStore } from './Sockets';

interface Store {
  /** Root store */
  root: RootStore;
  /** Сокеты */
  sockets: SocketsStore;
  /** Приложение */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  /** Комната */
  room: RoomStore;
  /** Словари */
  dictionaries: DictionariesStore;
  /** Страница создания/просмотра пака */
  createPack: CreatePackStore;
  /** Библиотека */
  library: LibraryStore;
  /** Домашняя страница */
  home: HomeStore;
}

export const store: Store = {
  root,
  app: root.app,
  player: root.player,
  room: root.room,
  dictionaries: root.dictionaries,
  createPack: root.createPack,
  library: root.library,
  home: root.home,
  sockets: root.sockets,
};

export const useStore = () => useContext(MobXProviderContext) as Store;
