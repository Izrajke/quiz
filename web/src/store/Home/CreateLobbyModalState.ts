import type { ChangeEvent } from 'react';

import type { NavigateFunction } from 'react-router';

import { action, computed, flow, makeObservable, observable } from 'mobx';

import { createLobby } from 'api';
import type { LibraryItem } from 'api';
import type { Option } from 'components';

import type { RootStore } from '../RootStore';

export class CreateLobbyModalState {
  /** Root store */
  root: RootStore;

  isOpen = false;

  roomName = '';
  password = '';
  packInfo: LibraryItem | null = null;
  players = 2;

  /** заполнены ли все обязательные поля */
  get isAllFieldsAreCompleted() {
    return !!(this.roomName && this.packInfo && this.players);
  }

  constructor(root: RootStore) {
    makeObservable(this, {
      // computed
      isAllFieldsAreCompleted: computed,
      // observable
      isOpen: observable,
      password: observable,
      packInfo: observable,
      players: observable,
      roomName: observable,
      // action
      setIsOpen: action,
      setRoomName: action,
      setPassword: action,
      setPlayers: action,
      resetAllFields: action,
      setPackInfo: action,
      // flow
      onCreateLobbyClick: flow.bound,
    });
    this.root = root;
  }

  setIsOpen = () => {
    this.isOpen = !this.isOpen;
  };

  setRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    this.roomName = e.target.value;
  };

  setPassword = (e: ChangeEvent<HTMLInputElement>) => {
    this.password = e.target.value;
  };

  setPlayers = (option: Option | null) => {
    if (option) {
      this.players = Number(option.value);
    }
  };

  setPackInfo = (packInfo: LibraryItem | null) => {
    this.packInfo = packInfo;
  };

  resetAllFields = () => {
    this.roomName = '';
    this.password = '';
    this.players = 2;
    this.packInfo = null;
  };

  *onCreateLobbyClick(navigate: NavigateFunction) {
    const { id } = (yield createLobby({
      name: this.roomName,
      password: this.password,
      players: this.players,
      packId: this.packInfo?.id || '',
    })) as { id: string };

    this.root.app.setRoomId(id);
    navigate(`/room/${this.root.app.roomId}`);
  }
}
