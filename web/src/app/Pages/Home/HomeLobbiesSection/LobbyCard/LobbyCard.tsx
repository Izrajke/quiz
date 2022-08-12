import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import type { HomeSocketLobbyCard } from 'store/Sockets/HomeSocket/types';

import { observer } from 'mobx-react-lite';

import { Typography, Button } from 'components';

import classes from './LobbyCard.module.css';

export const LobbyCard: FunctionComponent<HomeSocketLobbyCard> = observer(
  ({ players, max, subject, pack }) => {
    const renderPlayersArray = useMemo(
      () => new Array(max).fill(0).map((_, i) => (players[i] ? players[i] : 0)),
      [players, max],
    ).reverse();

    return (
      <div className={classes.wrapper}>
        <div className={classes.leftSide}>
          <Typography.Text color="white" type="text-1" weight="weight-bold">
            {pack}
          </Typography.Text>
          <Typography.Text color="white-50" type="text-0">
            {subject}
          </Typography.Text>
        </div>
        <div className={classes.rightSide}>
          <div className={classes.playersContainer}>
            {renderPlayersArray.map((player) =>
              player ? (
                <img
                  className={classes.avatar}
                  key={player.id}
                  src="https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg"
                  alt="avatar"
                />
              ) : (
                <div className={classes.noPlayer} />
              ),
            )}
          </div>
          <Button className={classes.button} type="primary">
            Войти
          </Button>
        </div>
      </div>
    );
  },
);

LobbyCard.displayName = 'LobbyCard';
