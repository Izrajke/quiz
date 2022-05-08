import { makeObservable, observable, action } from 'mobx';

import type { RootStore } from '../RootStore';

export class HomeStore {
  /** Root store */
  root: RootStore;
  isCreateLobbyModalOpen = false;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isCreateLobbyModalOpen: observable,
      // action
      setIsCreateLobbyModalOpen: action,
    });
    this.root = root;
  }

  setIsCreateLobbyModalOpen = () => {
    this.isCreateLobbyModalOpen = !this.isCreateLobbyModalOpen;
  };
}
