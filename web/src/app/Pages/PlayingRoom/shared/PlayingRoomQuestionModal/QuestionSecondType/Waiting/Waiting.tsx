import type { FunctionComponent } from 'react';

import { Typography, Modal } from 'components';
import { useStore } from 'store';

import classes from './Wating.module.css';

export const Waiting: FunctionComponent = () => {
  const { room } = useStore();
  return (
    <Modal.Body className={classes.root}>
      <Typography.Text type="text-1" color="white">
        Ожидание ответа остальных игроков...
      </Typography.Text>
      <div className={classes.answerContainer}>
        <Typography.Text type="caption-1" color="white-70">
          Ваш ответ:
        </Typography.Text>
        <Typography.Text type="caption-1" color="white" weight="weight-bold">
          {room.playerAnswer}
        </Typography.Text>
      </div>
    </Modal.Body>
  );
};

Waiting.displayName = 'Waiting';
