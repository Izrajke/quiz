import { AppStore } from './App';

export class RootStore {
  /** Стор приложения */
  app: AppStore;
  constructor() {
    this.app = new AppStore(this);
  }
}

export const root = new RootStore();
