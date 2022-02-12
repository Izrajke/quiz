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
  const { app } = useStore();

  useEffect(() => {
    app.room.setPlayerAnswer('');
    //eslint-disable-next-line
  }, [app.room.options]);

  /** Обработчик ответа на вопрос */
  const answerHandler = useCallback(
    (answer: SocketAnswer) => () => {
      if (app.socket) {
        app.socketMessage(answer);
        app.room.setPlayerAnswer(answer.option);
      }
    },
    [app],
  );

  /** Вычисляет стили для кнопки */
  const buttonStyle = computed(
    () => (id: string) =>
      clsx(
        classes.button,
        app.room.playerAnswer === id && classes.givenAnswer,
        app.room.answer === id && classes.rightAnswer,
      ),
  ).get();

  const isButtonDisabled = computed(() => !!app.room.playerAnswer).get();

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
              type={'regular'}
              className={buttonStyle(id)}
              onClick={answerHandler({
                type: SocketRequestType.sendAnswer,
                option: id,
              })}
              disabled={isButtonDisabled}
            >
              {app.room.options[id]}
            </Button>
          );
        })}
      </Modal.Body>
    </Modal>
  );
});

QuestionFirstType.displayName = 'QuestionFirstType';
