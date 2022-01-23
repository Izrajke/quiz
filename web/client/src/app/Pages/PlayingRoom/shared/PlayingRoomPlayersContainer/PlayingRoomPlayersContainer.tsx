import type { FunctionComponent } from 'react';

import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { PlayerCard } from './PlayerCard/PlayerCard';

import classes from './PlayingRoomPlayersContainer.module.css';

export const PlayingRoomPlayersContainer: FunctionComponent = observer(() => {
  const { app } = useStore();

  const playersArray = computed(() => {
    return app.room.players;
  }).get();

  return (
    <div className={classes.wrapper}>
      {playersArray.map((player) => (
        <PlayerCard
          key={player.id}
          id={player.id}
          name={player.name}
          points={player.points}
        />
      ))}
    </div>
  );
});

PlayingRoomPlayersContainer.displayName = 'PlayingRoomPlayersContainer';
