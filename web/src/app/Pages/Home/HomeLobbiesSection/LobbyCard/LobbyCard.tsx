import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Typography, Button } from 'components';
import type { HomeSocketLobbyCard } from 'store/Sockets/HomeSocket/types';

import classes from './LobbyCard.module.css';

export const LobbyCard: FunctionComponent<HomeSocketLobbyCard> = observer(
  ({ players, maximumOfPlayers, type, name }) => {
    console.log(maximumOfPlayers);

    const renderPlayersArray = useMemo(
      () =>
        new Array(maximumOfPlayers)
          .fill(0)
          .map((_, i) => (players[i] ? players[i] : 0)),
      [players, maximumOfPlayers],
    ).reverse();

    console.log(renderPlayersArray);

    return (
      <div className={classes.wrapper}>
        <div className={classes.leftSide}>
          <Typography.Text color="white" type="text-1" weight="weight-bold">
            {name}
          </Typography.Text>
          <Typography.Text color="white-50" type="text-0">
            {type}
          </Typography.Text>
        </div>
        <div className={classes.rightSide}>
          <div className={classes.playersContainer}>
            {renderPlayersArray.map((player) =>
              player ? (
                <img
                  className={classes.avatar}
                  key={player.id}
                  src={player.avatar}
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
