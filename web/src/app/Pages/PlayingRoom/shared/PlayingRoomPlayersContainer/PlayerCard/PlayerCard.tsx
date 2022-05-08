import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Typography } from 'components';
import { RoomPlayer } from 'store/Sockets/RoomSocket/types';

import { PlayerCardLine } from './PlayerCardLine';
import classes from './PlayerCard.module.css';

export type PlayerProps = RoomPlayer;

/** Компонент карточки игрока */
export const PlayerCard: FunctionComponent<PlayerProps> = observer(
  ({ id, name, points, color }) => {
    return (
      <div id={id} className={classes.wrapper}>
        <PlayerCardLine color={color} />
        <div className={classes.content}>
          <img
            className={classes.avatar}
            alt="avatar"
            src="https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg"
          />
          <div className={classes.textContainer}>
            <Typography.Text color="white-70" type="text-1">
              {name}
            </Typography.Text>
            <Typography.Text color="white" type="text-3" weight="weight-bold">
              {points}
            </Typography.Text>
          </div>
        </div>
      </div>
    );
  },
);

PlayerCard.displayName = 'PlayerCard';
