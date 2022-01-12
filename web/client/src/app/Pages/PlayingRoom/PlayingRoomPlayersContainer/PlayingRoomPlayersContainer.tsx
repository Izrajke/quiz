import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { PlayerCard } from './PlayerCard/PlayerCard';

import classes from './PlayingRoomPlayersContainer.module.css';

export const PlayingRoomPlayersContainer: FunctionComponent = observer(() => {
  return (
    <div className={classes.wrapper}>
      <PlayerCard />
    </div>
  );
});

PlayingRoomPlayersContainer.displayName = 'PlayingRoomPlayersContainer';
