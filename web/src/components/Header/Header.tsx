import type { FunctionComponent } from 'react';

import { observer, useLocalObservable } from 'mobx-react-lite';

import { useStore } from 'store';
import { Navigation, Icon, Typography, Input } from 'components';

import classes from './Header.module.css';
import { ChangeEvent } from 'react';

interface SettingsModalState {
  /** Обработчик нажатия на иконку настроек */
  onSettingsClick: () => void;
  /** Никнейм пользователя, в локальном стейте */
  nickname: string;
  /** Обновить никнейм локально */
  onChangeNickname: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Сохранить никнем в сторе */
  saveNickname: () => void;
}

export const Header: FunctionComponent = observer(() => {
  const { player, app } = useStore();

  const state = useLocalObservable<SettingsModalState>(() => ({
    nickname: player.nickname,
    onChangeNickname(e) {
      this.nickname = e.target.value;
    },
    saveNickname() {
      player.setNickname(this.nickname);
    },
    onSettingsClick() {
      app.setDialog({
        header: (
          <Typography.Text color="white" type="text-0" weight="weight-bold">
            Настройки
          </Typography.Text>
        ),
        body: (
          <Input
            placeholder="123"
            defaultValue={this.nickname}
            onChange={this.onChangeNickname}
            label="Никнейм"
          />
        ),
        dialogButtons: [
          {
            type: 'primary',
            onClick: this.saveNickname,
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
    </header>
  );
});

Header.displayName = 'Header';
