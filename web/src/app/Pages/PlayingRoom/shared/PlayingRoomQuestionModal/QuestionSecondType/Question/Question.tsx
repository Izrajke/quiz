import { useState, useCallback, useMemo } from 'react';
import type { FunctionComponent, ChangeEvent } from 'react';

import { RoomSocketRequestType } from 'store/Sockets/RoomSocket/types';

import { observer } from 'mobx-react-lite';

import { Modal, Typography, Input, Button } from 'components';
import { useStore } from 'store';

import classes from './Question.module.css';

export const Question: FunctionComponent = observer(() => {
  const [answer, setAnswer] = useState('');
  const { room, sockets } = useStore();

  const answerHandler = useCallback(() => {
    if (answer) {
      room.setPlayerAnswer(answer);
      sockets.roomSocket.send({
        type: RoomSocketRequestType.sendAnswer,
        option: answer,
      });
    }
    // eslint-disable-next-line
  }, [room, answer]);

  const onAnswerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAnswer(e.target.value);
    },
    [setAnswer],
  );

  const isDisabled = useMemo(() => !!room.playerAnswer, [room.playerAnswer]);

  return (
    <>
      <Modal.Header>
        <Typography.Text
          className={classes.question}
          type="text-2"
          color="white"
        >
          {room.title}
        </Typography.Text>
      </Modal.Header>
      <Modal.Body className={classes.questionBody}>
        <Input placeholder="Ваш ответ" onChange={onAnswerChange} />
        <Button type="regular" onClick={answerHandler} disabled={isDisabled}>
          Отправить
        </Button>
      </Modal.Body>
    </>
  );
});

Question.displayName = 'Question';
