import type { ChangeEvent } from 'react';

import { makeObservable, observable, action } from 'mobx';

import type { RootStore } from '../RootStore';
import type {
  HomeSocketMessage,
  HomeSocketCreatedLobbies,
  HomeSocketLobbyCard,
} from '../Sockets/HomeSocket';

import { CreateLobbyModalState } from './CreateLobbyModalState';

export class HomeStore {
  /** Root store */
  root: RootStore;
  /** Модальное окно создания лобби */
  createLobbyModal: CreateLobbyModalState;
  /** Массив всех сообщений */
  messages: HomeSocketMessage[] = [];
  /** Созданные лобби */
  lobbies: HomeSocketLobbyCard[] = [];

  /** Текст сообщения */
  newMessageValue = '';

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      messages: observable,
      newMessageValue: observable,
      lobbies: observable,
      createLobbyModal: observable,
      // action
      setMessage: action,
      setNewMessageValue: action,
      sendMessage: action,
      setLobbies: action,
    });
    this.root = root;
    this.createLobbyModal = new CreateLobbyModalState(this.root);
  }

  setMessage = (message: HomeSocketMessage) => {
    this.messages.push(message);
  };

  setLobbies = (data: HomeSocketCreatedLobbies) => {
    const { rooms } = data;

    this.lobbies = rooms;
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
