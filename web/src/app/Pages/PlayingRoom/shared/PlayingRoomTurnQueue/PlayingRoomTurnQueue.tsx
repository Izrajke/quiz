import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { Attack } from './Attack';
import { Capture } from './Capture';

import classes from './PlayingRoomTurnQueue.module.css';

export const PlayingRoomTurnQueue: FunctionComponent = observer(() => {
  const { room } = useStore();

  if (!room.turnQueue) return null;

  return (
    <div className={classes.root}>
      {room.turnQueue && room.moveStatus !== 'attack' ? (
        <Capture />
      ) : (
        <Attack />
      )}
    </div>
  );
});

PlayingRoomTurnQueue.displayName = 'PlayingRoomTurnQueue';
