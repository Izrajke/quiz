import type { FunctionComponent, ChangeEvent, ChangeEventHandler } from 'react';

import { observer, useLocalObservable } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { computed } from 'mobx';

import { createLobby } from 'api';

import { Modal, Input, Typography, Button, Select } from 'components';
import { useStore } from 'store';

import classes from './HomeCreateRoomModal.module.css';

export interface HomeCreateRoomModalProps {
  open: boolean;
  setOpen: () => void;
}

interface HomeCreateRoomState {
  roomName: string;
  password: string;
  players: number;
  setRoomName: (e: ChangeEvent<HTMLInputElement>) => void;
  setPassword: (e: ChangeEvent<HTMLInputElement>) => void;
  setPlayers: ChangeEventHandler<HTMLSelectElement>;
  resetAllFields: () => void;
}

export const HomeCreateRoomModal: FunctionComponent<HomeCreateRoomModalProps> =
  observer(({ open, setOpen }) => {
    const { app } = useStore();
    const navigate = useNavigate();

    const state = useLocalObservable<HomeCreateRoomState>(() => ({
      roomName: '',
      password: '',
      players: 2,
      setRoomName(e) {
        this.roomName = e.target.value;
      },
      setPassword(e) {
        this.password = e.target.value;
      },
      setPlayers(e) {
        this.players = Number(e.target.value);
      },
      resetAllFields() {
        this.roomName = '';
        this.password = '';
        this.players = 2;
      },
    }));

    const onCreateLobbyClick = async () => {
      const { id } = (await createLobby({
        name: state.roomName,
        password: state.password,
        players: state.players,
      })) as { id: string };

      app.setRoomId(id);
      navigate(`/room/${app.roomId}`);
    };

    const onCancelClick = computed(() => () => {
      state.resetAllFields();
      setOpen();
    }).get();

    const playersSelectOptions = computed(() => [2, 3, 4]).get();

    return (
      <Modal show={open} closeModal={setOpen}>
        <Modal.Header>
          <Typography.Text color="white" type="text-0" weight="weight-bold">
            Создание лобби
          </Typography.Text>
        </Modal.Header>
        <Modal.Body className={classes.body}>
          <div className={classes.labelsContainer}>
            <Typography.Text color="white-50" type="caption-1">
              Название лобби
            </Typography.Text>
            <Typography.Text color="white-50" type="caption-1">
              Кол-во игроков
            </Typography.Text>
          </div>
          <div className={classes.inputsContainer}>
            <Input defaultValue={state.roomName} onChange={state.setRoomName} />
            <Select
              options={playersSelectOptions}
              onChange={state.setPlayers}
            />
          </div>
          <Input
            label="Пароль от лобби (необязательно)"
            className={classes.password}
            defaultValue={state.password}
            onChange={state.setPassword}
          />
        </Modal.Body>
        <Modal.Footer className={classes.footer}>
          <Button type="default" onClick={onCancelClick}>
            Отмена
          </Button>
          <Button
            className={classes.createButton}
            type="primary"
            onClick={onCreateLobbyClick}
          >
            Создать лобби
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });

HomeCreateRoomModal.displayName = 'HomeCreateRoomModal';
