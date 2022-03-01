import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { Typography, Modal } from 'components';

import { AnswerBar } from './AnswerBar';
import { RigthAnswerPointer } from './RigthAnswerPointer';

import classes from './Result.module.css';

/** Рузультаты игроков после ответа на вопрос второго типа */
export const Result: FunctionComponent = observer(() => {
  const { room } = useStore();

  const maximumPoints = useMemo(
    () => [...room.answerOptions].sort((a, b) => b.value - a.value)[0].value,
    [room.answerOptions],
  );

  return (
    <>
      <Modal.Body className={classes.resultBody}>
        <RigthAnswerPointer maximumPoints={maximumPoints} />
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
