import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Divider, Button } from 'components';
import { useStore } from 'store';

import { LobbyCard } from './LobbyCard';

import classes from './HomeLobbiesSection.module.css';

export const HomeLobbiesSection: FunctionComponent = observer(() => {
  const { home } = useStore();

  return (
    <Paper className={classes.lobbies}>
      <div className={classes.lobbiesContainer}>
        {home.lobbies.map((card) => (
          <LobbyCard key={card.id} {...card} />
        ))}
      </div>
      <Divider className={classes.divider} />
      <Button
        className={classes.createLobbiesButton}
        type="primary"
        onClick={home.setIsCreateLobbyModalOpen}
      >
        Создать лобби
      </Button>
    </Paper>
  );
});

HomeLobbiesSection.displayName = 'HomeLobbiesSection';
