import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { PlayerCard } from './PlayerCard/PlayerCard';

import classes from './PlayingRoomPlayersContainer.module.css';

export const PlayingRoomPlayersContainer: FunctionComponent = observer(() => {
  const { app } = useStore();

  return (
    <div className={classes.wrapper}>
      {app.room.players.map((player) => (
        <PlayerCard
          key={player.id}
          id={player.id}
          name={player.name}
          points={player.points}
          color={player.color}
        />
      ))}
    </div>
  );
});

PlayingRoomPlayersContainer.displayName = 'PlayingRoomPlayersContainer';
