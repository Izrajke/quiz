import type { ChangeEvent, FunctionComponent } from 'react';

import { observer, useLocalObservable } from 'mobx-react-lite';

import { useStore } from 'store';

import {
  Paper,
  Textarea,
  Button,
  Divider,
  Typography,
  Icon,
  Input,
} from 'components';

import { HomeCreateRoomModal } from './HomeCreateRoomModal';

import classes from './Home.module.css';

interface HomeSettingsModalState {
  /** Обработчик нажатия на иконку настроек */
  onSettingsClick: () => void;
  /** Никнейм пользователя, в локальном стейте */
  nickname: string;
  /** Обновить никнейм локально */
  onChangeNickname: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Сохранить никнем в сторе */
  saveNickname: () => void;
  /** Открыто ли модальное окно создания лобби */
  isCreateLobbyModalOpen: boolean;
  /** Открыть или закрыть модальное окно создания лобби */
  setCreateLobbyModal: () => void;
}

export const Home: FunctionComponent = observer(() => {
  const { app, player } = useStore();

  const state = useLocalObservable<HomeSettingsModalState>(() => ({
    nickname: player.nickname,
    isCreateLobbyModalOpen: false,
    setCreateLobbyModal() {
      this.isCreateLobbyModalOpen = !this.isCreateLobbyModalOpen;
    },
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
    <div className={classes.wrapper}>
      <HomeCreateRoomModal
        open={state.isCreateLobbyModalOpen}
        setOpen={state.setCreateLobbyModal}
      />
      <header className={classes.header}>
        <Typography.Text color="white" type="text-0">
          О игре
        </Typography.Text>
        <Typography.Text
          color="white"
          type="text-0"
          className={classes.nickname}
        >
          {player.nickname}
        </Typography.Text>
        <Icon
          className={classes.icon}
          type="cog"
          size={16}
          onClick={state.onSettingsClick}
        />
      </header>
      <div className={classes.body}>
        <Paper className={classes.chat}>
          <div className={classes.messagesContainer}></div>
          <Textarea
            className={classes.textarea}
            placeholder="Введите сообщение ..."
          />
        </Paper>
        <Paper className={classes.lobbys}>
          <div className={classes.lobbysContainer}></div>
          <Divider className={classes.divider} />
          <Button
            className={classes.createLobbybutton}
            type="primary"
            onClick={state.setCreateLobbyModal}
          >
            Создать лобби
          </Button>
        </Paper>
      </div>
    </div>
  );
});
