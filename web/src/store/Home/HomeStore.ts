import { makeObservable, observable, action } from 'mobx';

import type { RootStore } from '../RootStore';
import type { HomeSocketMessage } from '../Sockets/HomeSocket';

export class HomeStore {
  /** Root store */
  root: RootStore;
  isCreateLobbyModalOpen = false;
  messages: HomeSocketMessage[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isCreateLobbyModalOpen: observable,
      messages: observable,
      // action
      setIsCreateLobbyModalOpen: action,
      setMessage: action,
    });
    this.root = root;
  }

  setIsCreateLobbyModalOpen = () => {
    this.isCreateLobbyModalOpen = !this.isCreateLobbyModalOpen;
  };

  setMessage = (message: HomeSocketMessage) => {
    this.messages.push(message);
  };
}
