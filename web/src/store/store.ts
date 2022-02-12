import { useContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AppStore } from './App';
import { RootStore, root } from './RootStore';
import { PlayerStore } from './Player';

interface Store {
  /** Root store */
  root: RootStore;
  /** Приложение */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
}

export const store: Store = {
  root,
  app: root.app,
  player: root.player,
};

export const useStore = () => useContext(MobXProviderContext) as Store;
