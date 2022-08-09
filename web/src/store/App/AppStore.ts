import { makeObservable, observable, action } from 'mobx';

import type { RootStore } from 'store';
import type { DialogProps } from 'components';

export class AppStore {
  /** Root store */
  root: RootStore;
  /** Статус инициализации */
  isInit = false;
  /** Ссылка на созданную комнату */
  roomId = '';
  /** Модальные окна */
  dialogs: DialogProps[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      isInit: observable,
      roomId: observable,
      dialogs: observable,
      // action
      init: action,
      setDialog: action,
      removeDialog: action,
      setRoomId: action,
    });
    this.root = root;
  }

  /** Инициальзация приложения */
  init() {
    this.root.dictionaries.load();
    this.isInit = true;
  }

  setDialog(dialog: DialogProps) {
    this.dialogs.push(dialog);
  }

  removeDialog = () => {
    this.dialogs.shift();
  };

  setRoomId = (newId: string) => {
    this.roomId = newId;
  };
}
