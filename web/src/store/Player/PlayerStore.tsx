import { PlayerColors, RoomPlayer } from 'store/Sockets/RoomSocket/types';

import { makeObservable, observable, action } from 'mobx';



import { genDefaultConfig } from 'components';
import type { AvatarConfig } from 'components';
import { getFromLocalStorage, addToLocalStorage } from 'utils';

import { RootStore } from '../RootStore';


/** Информация о игроке */
export class PlayerStore {
  /** Root store */
  root: RootStore;
  /** Никнейм */
  nickname = localStorage.getItem('nickname') || 'Anonim';
  /** Цвет */
  color?: PlayerColors;
  /** uuid */
  id = '';
  /** конфиг аватарки пользователя */
  avatarConfig: AvatarConfig;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      color: observable,
      nickname: observable,
      id: observable,
      avatarConfig: observable,
      // action
      setNickname: action,
      setPlayerInfo: action,
      setAvatarConfig: action,
    });
    this.root = root;

    const savedAvatarConfig = getFromLocalStorage('avatarConfig');

    this.avatarConfig = savedAvatarConfig
      ? savedAvatarConfig
      : (genDefaultConfig() as AvatarConfig);
  }

  setNickname = (nickname: string) => {
    this.nickname = nickname;
    localStorage.setItem('nickname', nickname);
  };

  setAvatarConfig = (config: AvatarConfig) => {
    addToLocalStorage('avatarConfig', config);
    this.avatarConfig = config;
  };

  /** Устанавливает id и цвет игрока */
  setPlayerInfo = () => {
    const { id, color } = this.root.room.players.find(
      (player) => player.name === this.nickname,
    ) as RoomPlayer;
    this.id = id;
    this.color = color;
  };
}
