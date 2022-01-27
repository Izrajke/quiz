import { makeObservable, observable, action } from 'mobx';

import { RootStore } from '../RootStore';

/** Информация о игроке */
export class PlayerStore {
  /** Root store */
  root: RootStore;
  /** Никнейм */
  nickname = localStorage.getItem('nickname') || 'Anonim';
  constructor(root: RootStore) {
    makeObservable(this, {
      nickname: observable,
      setNickname: action,
    });
    this.root = root;
  }

  setNickname = (nickname: string) => {
    this.nickname = nickname;
    localStorage.setItem('nickname', nickname);
  };
}
