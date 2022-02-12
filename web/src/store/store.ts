import { useContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AppStore } from './App';
import { RootStore, root } from './RootStore';
import { PlayerStore } from './Player';
import { RoomStore } from './Room';

interface Store {
  /** Root store */
  root: RootStore;
  /** Приложение */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  /** Комната */
  room: RoomStore;
}

export const store: Store = {
  root,
  app: root.app,
  player: root.player,
  room: root.room,
};

export const useStore = () => useContext(MobXProviderContext) as Store;
