import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';
import { computed } from 'mobx';

import { Modal, Input, Typography, Button, Select, Icon } from 'components';
import { useStore } from 'store';

import classes from './CreateRoomModal.module.css';

export const CreateRoomModal: FunctionComponent = observer(() => {
  const {
    home: { createLobbyModal },
  } = useStore();
  const navigate = useNavigate();

  const onCreateLobbyClick = () => {
    createLobbyModal.onCreateLobbyClick(navigate);
  };

  const onChoosePackHandler = useCallback(() => {
    createLobbyModal.setIsOpen();
    navigate('/library');
  }, [navigate, createLobbyModal]);

  const onDeletePack = useCallback(() => {
    createLobbyModal.setPackInfo(null);
  }, [createLobbyModal]);

  const onCancelClick = computed(() => () => {
    createLobbyModal.resetAllFields();
    createLobbyModal.setIsOpen();
  }).get();

  const playersSelectOptions = computed(() => [2, 3, 4]).get();

  return (
    <Modal
      show={createLobbyModal.isOpen}
      closeModal={createLobbyModal.setIsOpen}
    >
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
          <Input
            defaultValue={createLobbyModal.roomName}
            onChange={createLobbyModal.setRoomName}
          />
          <Select
            options={playersSelectOptions}
            onChange={createLobbyModal.setPlayers}
          />
        </div>
        <Input
          label="Пароль от лобби (необязательно)"
          className={classes.password}
          defaultValue={createLobbyModal.password}
          onChange={createLobbyModal.setPassword}
        />
        <div className={classes.choosePackContainer}>
          <Typography.Text color="white-50" type="caption-1">
            Пак вопросов
          </Typography.Text>
          {createLobbyModal.packInfo ? (
            <div className={classes.pack}>
              <div className={classes.packTextInfoSide}>
                <Typography.Text color="white" type="text-0">
                  {createLobbyModal.packInfo.name}
                </Typography.Text>
                <Typography.Text color="white-50" type="caption-1">
                  {createLobbyModal.packInfo.type}
                </Typography.Text>
              </div>
              <Icon
                className={classes.closeIcon}
                onClick={onDeletePack}
                type="close"
                color="white"
                size={24}
              />
            </div>
          ) : (
            <div className={classes.choosePackButtons}>
              <Button
                type="primary"
                className={classes.choosePackButton}
                onClick={onChoosePackHandler}
              >
                Выбрать пак
              </Button>
              <Icon type="random" className={classes.randomIcon} size={32} />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className={classes.footer}>
        <Button type="default" onClick={onCancelClick}>
          Отмена
        </Button>
        <Button
          className={classes.createButton}
          type="primary"
          onClick={onCreateLobbyClick}
          disabled={!createLobbyModal.isAllFieldsAreCompleted}
        >
          Создать лобби
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

CreateRoomModal.displayName = 'HomeCreateRoomModal';
