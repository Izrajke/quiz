import { useCallback, useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import classes from './Capture.module.css';

export const Capture: FunctionComponent = observer(() => {
  const { room } = useStore();
  const renderArray = useMemo(
    () => Array(room.turnQueue as number).fill(0),
    [room.turnQueue],
  );

  const calculateTurnBarStyle = useCallback(
    (turnNumber) => {
      return clsx(
        classes.turnBar,
        turnNumber < room.currentTurn && classes.turnBarPast,
        turnNumber === room.currentTurn && classes.turnBarActive,
        turnNumber > room.currentTurn && classes.turnBarFuture,
      );
    },
    [room.currentTurn],
  );

  return (
    <div className={classes.wrapper}>
      {renderArray.map((turn, index) => (
        <div
          key={index}
          className={calculateTurnBarStyle(index + 1)}
          data-testid="TurnBar"
        />
      ))}
    </div>
  );
});

Capture.displayName = 'Capture';
