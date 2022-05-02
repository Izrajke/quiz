import { useContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AppStore } from './App';
import { RootStore, root } from './RootStore';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';
import { DictionariesStore } from './Dictionaries';
import { CreatePackStore } from './CreatePack';
import { LibraryStore } from './Library';

interface Store {
  /** Root store */
  root: RootStore;
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
}

export const store: Store = {
  root,
  app: root.app,
  player: root.player,
  room: root.room,
  dictionaries: root.dictionaries,
  createPack: root.createPack,
  library: root.library,
};

export const useStore = () => useContext(MobXProviderContext) as Store;
