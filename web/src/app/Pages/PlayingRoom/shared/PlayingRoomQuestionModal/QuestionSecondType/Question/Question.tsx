import { useState, useCallback, useMemo } from 'react';
import type { FunctionComponent, ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { Modal, Typography, Input, Button } from 'components';

import classes from './Question.module.css';

export const Question: FunctionComponent = observer(() => {
  const [answer, setAnswer] = useState('');
  const { room } = useStore();

  //TODO - Доделать модалку присравнении ответов
  const answerHandler = useCallback(() => {
    room.setPlayerAnswer(answer);
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
