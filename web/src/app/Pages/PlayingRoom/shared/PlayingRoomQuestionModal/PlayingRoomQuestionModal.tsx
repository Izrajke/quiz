import { useCallback, useState, useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { Modal, Button, Typography } from 'components';

import { useStore } from 'store';
import type { ISocketAnswer } from 'api';

import classes from './PlayingRoomQuestionModal.module.css';

export const PlayingRoomQuestionModal: FunctionComponent = observer(() => {
  const { app } = useStore();
  // TODO убрать, использовать app.room.playerAnswer
  const [localAnswer, setLocalAnswer] = useState('');

  useEffect(() => {
    setLocalAnswer('');
  }, [app.room.options]);

  /** Обработчик ответа на вопрос */
  const answerHandler = (answer: ISocketAnswer) => () => {
    if (app.socket) {
      app.socketMessage(answer);
      app.room.playerAnswer = answer.option;
      setLocalAnswer(answer.option);
    }
  };

  /** Вычисляет стили для кнопки */
  const buttonStyle = useCallback(
    (id) =>
      clsx(
        classes.button,
        localAnswer === id && classes.givenAnswer,
        app.room.answer === id && classes.rightAnswer,
      ),
    [app.room.answer, localAnswer],
  );

  return (
    <Modal show={app.room.isQuestionModalOpen} className={classes.modal}>
      <Modal.Header>
        <Typography.Text
          className={classes.question}
          type="text-2"
          color="white"
        >
          {app.room.title}
        </Typography.Text>
      </Modal.Header>
      <Modal.Body className={classes.body}>
        {Object.keys(app.room.options).map((id, index) => {
          return (
            <Button
              key={index}
              type={localAnswer ? 'disabled' : 'regular'}
              className={buttonStyle(id)}
              onClick={answerHandler({
                type: 1,
                option: id,
              })}
            >
              {app.room.options[id]}
            </Button>
          );
        })}
      </Modal.Body>
    </Modal>
  );
});

PlayingRoomQuestionModal.displayName = 'PlayingRoomQuestionModal';
