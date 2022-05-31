import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { PlayerCard } from './PlayerCard/PlayerCard';

import classes from './PlayingRoomPlayersContainer.module.css';

export const PlayingRoomPlayersContainer: FunctionComponent = observer(() => {
  const { room } = useStore();

  return (
    <div className={classes.wrapper}>
      {room.players.map((player) => (
        <PlayerCard key={player.id} {...player} />
      ))}
    </div>
  );
});

PlayingRoomPlayersContainer.displayName = 'PlayingRoomPlayersContainer';
