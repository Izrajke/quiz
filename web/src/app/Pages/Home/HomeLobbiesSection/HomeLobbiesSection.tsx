import type { FunctionComponent } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { observer } from 'mobx-react-lite';

import { Paper, Divider, Button } from 'components';
import { useStore } from 'store';

import classes from './HomeLobbiesSection.module.css';
import './animation.css';
import { LobbyCard } from './LobbyCard';

export const HomeLobbiesSection: FunctionComponent = observer(() => {
  const { home } = useStore();

  return (
    <Paper className={classes.lobbies}>
      <TransitionGroup className={classes.lobbiesContainer}>
        {home.lobbies.map((card) => (
          <CSSTransition key={card.id} classNames="lobby" timeout={140}>
            <LobbyCard {...card} />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <Divider className={classes.divider} />
      <Button
        className={classes.createLobbiesButton}
        type="primary"
        onClick={home.createLobbyModal.setIsOpen}
      >
        Создать лобби
      </Button>
    </Paper>
  );
});

HomeLobbiesSection.displayName = 'HomeLobbiesSection';
