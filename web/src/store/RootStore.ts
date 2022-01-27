import { AppStore } from './App';
import { PlayerStore } from './Player';

export class RootStore {
  /** Стор приложения */
  app: AppStore;
  /** Игрок */
  player: PlayerStore;
  constructor() {
    this.app = new AppStore(this);
    this.player = new PlayerStore(this);
  }
}

export const root = new RootStore();
