import { useCallback, useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type { PlayerColors } from 'api';
import { useStore } from 'store';

import classes from './Attack.module.css';

export const Attack: FunctionComponent = observer(() => {
  const { room } = useStore();
  const renderArray = useMemo(() => {
    const turnQueue = [...(room.turnQueue as PlayerColors[])];
    const stepsCount =
      turnQueue.length / (room.players.length ? room.players.length : 1);
    return Array(stepsCount)
      .fill([])
      .map(() => [...turnQueue.splice(0, room.players.length)]);
  }, [room.turnQueue, room.players]);

  const calculateTurnBarStyle = useCallback(
    (
      playerColor: PlayerColors,
      stepIndex: number,
      turnNumberInStep: number,
    ) => {
      const turnNumber = stepIndex * room.players.length + turnNumberInStep;
      const isActive = turnNumber === room.currentTurn;

      return clsx(
        classes.turnBar,
        classes[playerColor],
        isActive && classes.turnBarActive,
        turnNumber < room.currentTurn && classes.turnBarPast,
      );
    },
    [room.players, room.currentTurn],
  );

  return (
    <div className={classes.wrapper}>
      {renderArray.map((step, i) => (
        <div key={i} className={classes.step} data-testid="StepContainer">
          {step.map((turn, j) => (
            <div
              key={j}
              className={calculateTurnBarStyle(turn, i, j + 1)}
              data-testid="TurnBar"
            />
          ))}
        </div>
      ))}
    </div>
  );
});

Attack.displayName = 'Attack';
