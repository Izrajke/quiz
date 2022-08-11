import type { FunctionComponent, ChangeEvent } from 'react';

import { observer, useLocalObservable } from 'mobx-react-lite';

import { Navigation, Icon, Typography, Avatar } from 'components';
import type { AvatarConfig } from 'components';
import { useStore } from 'store';


import classes from './Header.module.css';
import { HeaderSettingsModalBody } from './HeaderSettingsModalBody';

export interface SettingsModalState {
  /** Обработчик нажатия на иконку настроек */
  onSettingsClick: () => void;
  /** Текущий конфиг аватарки */
  avatarConfig: AvatarConfig;
  /** Установить конфиг */
  setAvatarConfig: (config: AvatarConfig) => void;
  /** Никнейм пользователя, в локальном стейте */
  nickname: string;
  /** Обновить никнейм локально */
  onChangeNickname: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Сохранить никнем в сторе */
  save: () => void;
}

export const Header: FunctionComponent = observer(() => {
  const { player, app } = useStore();

  const state = useLocalObservable<SettingsModalState>(() => ({
    nickname: player.nickname,
    onChangeNickname(e) {
      this.nickname = e.target.value;
    },
    avatarConfig: player.avatarConfig,
    setAvatarConfig(config: AvatarConfig) {
      this.avatarConfig = config;
    },
    save() {
      player.setNickname(this.nickname);
      player.setAvatarConfig(this.avatarConfig);
    },
    onSettingsClick() {
      app.setDialog({
        header: (
          <Typography.Text color="white" type="text-0" weight="weight-bold">
            Настройки
          </Typography.Text>
        ),
        body: (
          <HeaderSettingsModalBody
            defaultConfig={this.avatarConfig}
            setDefaultConfig={this.setAvatarConfig}
            nickname={this.nickname}
            onChangeNickname={this.onChangeNickname}
          />
        ),
        dialogButtons: [
          {
            type: 'primary',
            onClick: this.save,
            size: 'normal',
            text: 'Сохранить',
            className: classes.dialogButton,
            clickType: 'submit',
          },
        ],
      });
    },
  }));

  return (
    <header className={classes.header}>
      <Navigation />
      <Typography.Text color="white" type="text-0" className={classes.nickname}>
        {player.nickname}
      </Typography.Text>
      <Icon
        className={classes.icon}
        type="cog"
        size={16}
        onClick={state.onSettingsClick}
      />
      <Avatar size={40} config={player.avatarConfig} />
    </header>
  );
});

Header.displayName = 'Header';
