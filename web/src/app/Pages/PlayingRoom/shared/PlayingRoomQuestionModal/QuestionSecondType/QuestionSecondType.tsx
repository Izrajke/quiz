import { useCallback, useState, useMemo } from 'react';
import type { FunctionComponent, ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { Modal, Button, Typography, Input } from 'components';

import classes from './QuestionSecondType.module.css';

export const QuestionSecondType: FunctionComponent = observer(() => {
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
    <Modal show={room.isQuestionModalOpen}>
      <Modal.Header>
        <Typography.Text
          className={classes.question}
          type="text-2"
          color="white"
        >
          {room.title}
        </Typography.Text>
      </Modal.Header>
      <Modal.Body className={classes.body}>
        <Input placeholder="Ваш ответ" onChange={onAnswerChange} />
        <Button type="regular" onClick={answerHandler} disabled={isDisabled}>
          Отправить
        </Button>
      </Modal.Body>
    </Modal>
  );
});

QuestionSecondType.displayName = 'QuestionSecondType';
