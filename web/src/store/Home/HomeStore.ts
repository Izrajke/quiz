import type { ChangeEvent } from 'react';
import { makeObservable, observable, action } from 'mobx';

import type { RootStore } from '../RootStore';
import type { HomeSocketMessage } from '../Sockets/HomeSocket';

export class HomeStore {
  /** Root store */
  root: RootStore;
  isCreateLobbyModalOpen = false;
  /** Массив всех сообщений */
  messages: HomeSocketMessage[] = [];

  /** Текст сообщения */
  newMessageValue = '';

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isCreateLobbyModalOpen: observable,
      messages: observable,
      newMessageValue: observable,
      // action
      setIsCreateLobbyModalOpen: action,
      setMessage: action,
      setNewMessageValue: action,
      sendMessage: action,
    });
    this.root = root;
  }

  setIsCreateLobbyModalOpen = () => {
    this.isCreateLobbyModalOpen = !this.isCreateLobbyModalOpen;
  };

  setMessage = (message: HomeSocketMessage) => {
    this.messages.push(message);
  };

  sendMessage = () => {
    this.root.sockets.homeSocket.send({
      type: 10,
      message: this.newMessageValue,
    });

    this.newMessageValue = '';
  };

  setNewMessageValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === '\n') {
      return;
    }

    this.newMessageValue = e.target.value;
  };
}
