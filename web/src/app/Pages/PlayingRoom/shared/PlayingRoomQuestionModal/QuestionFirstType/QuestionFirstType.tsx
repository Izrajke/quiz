import { useEffect, useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';

import clsx from 'clsx';

import { Modal, Button, Typography } from 'components';

import { useStore } from 'store';
import { SocketRequestType } from 'api';
import type { SocketAnswer } from 'api';

import classes from './QuestionFirstType.module.css';

export type QuestionFirstTypeComponent = FunctionComponent;

export const QuestionFirstType: QuestionFirstTypeComponent = observer(() => {
  const { app, room } = useStore();

  useEffect(() => {
    room.setPlayerAnswer('');
    //eslint-disable-next-line
  }, [room.options]);

  /** Обработчик ответа на вопрос */
  const answerHandler = useCallback(
    (answer: SocketAnswer) => () => {
      if (app.socket) {
        app.socketMessage(answer);
        room.setPlayerAnswer(answer.option);
      }
    },
    [app, room],
  );

  /** Вычисляет стили для кнопки */
  const buttonStyle = computed(
    () => (id: string) =>
      clsx(
        classes.button,
        room.playerAnswer === id && classes.givenAnswer,
        room.answer === id && classes.rightAnswer,
      ),
  ).get();

  const isButtonDisabled = computed(() => !!room.playerAnswer).get();

  return (
    <Modal show={room.isQuestionModalOpen} className={classes.modal}>
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
        {Object.keys(room.options).map((id, index) => {
          return (
            <Button
              key={index}
              type={'regular'}
              className={buttonStyle(id)}
              onClick={answerHandler({
                type: SocketRequestType.sendAnswer,
                option: id,
              })}
              disabled={isButtonDisabled}
            >
              {room.options[id]}
            </Button>
          );
        })}
      </Modal.Body>
    </Modal>
  );
});

QuestionFirstType.displayName = 'QuestionFirstType';
