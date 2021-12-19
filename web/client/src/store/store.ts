import { useContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AppStore } from './App';
import { RootStore, root } from './RootStore';

interface IStore {
  /** Root store */
  root: RootStore;
  /** Приложение */
  app: AppStore;
}

export const store: IStore = {
  root,
  app: root.app,
};

export const useStore = () => useContext(MobXProviderContext) as IStore;
