import { useEffect, useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { RoomSocketRequestType } from 'store/Sockets/RoomSocket/types';
import type { RoomSocketAnswer } from 'store/Sockets/RoomSocket/types';

import clsx from 'clsx';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';


import { Modal, Button, Typography } from 'components';
import { useStore } from 'store';


import classes from './QuestionFirstType.module.css';

export type QuestionFirstTypeComponent = FunctionComponent;

export const QuestionFirstType: QuestionFirstTypeComponent = observer(() => {
  const { sockets, room } = useStore();

  useEffect(() => {
    room.setPlayerAnswer('');
    //eslint-disable-next-line
  }, [room.options]);

  /** Обработчик ответа на вопрос */
  const answerHandler = useCallback(
    (answer: RoomSocketAnswer) => () => {
      sockets.roomSocket.send(answer);
      room.setPlayerAnswer(answer.option);
    },
    // eslint-disable-next-line
    [sockets.roomSocket],
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
                type: RoomSocketRequestType.sendAnswer,
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
