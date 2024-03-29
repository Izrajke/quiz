import type { FunctionComponent } from 'react';
import { useMemo } from 'react';

import { observer } from 'mobx-react-lite';

import { Modal, Typography } from 'components';
import { useStore } from 'store';

import { AnswerBar } from './AnswerBar';
import classes from './Result.module.css';
import { RightAnswerPointer } from './RigthAnswerPointer';


/** Рузультаты игроков после ответа на вопрос второго типа */
export const Result: FunctionComponent = observer(() => {
  const { room } = useStore();

  const maximumPoints = useMemo(() => {
    const maxFromAnswers = room.answerOptions.reduce(
      (acc, curr) => (acc.value > curr.value ? acc : curr),
      { value: 0 },
    ).value;

    return maxFromAnswers > Number(room.answer)
      ? maxFromAnswers
      : Number(room.answer);
  }, [room.answerOptions, room.answer]);

  return (
    <>
      <Modal.Body className={classes.resultBody}>
        <RightAnswerPointer maximumPoints={maximumPoints} />
        <div className={classes.barsContainer}>
          {room.answerOptions.map((option) => {
            return (
              <div className={classes.playerResultContainer} key={option.color}>
                <Typography.Text
                  className={classes.nickname}
                  type="text-0"
                  color="white"
                >
                  {option.name}
                </Typography.Text>
                <AnswerBar
                  maximumPoints={maximumPoints}
                  player={option.color}
                  points={option.value}
                  time={option.time}
                />
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </>
  );
});

Result.displayName = 'Result';
