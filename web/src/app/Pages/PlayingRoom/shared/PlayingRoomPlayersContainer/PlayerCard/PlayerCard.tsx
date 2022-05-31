import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Typography, Avatar } from 'components';
import { encodeBase64 } from 'utils';
import { RoomPlayer } from 'store/Sockets/RoomSocket/types';

import { PlayerCardLine } from './PlayerCardLine';
import classes from './PlayerCard.module.css';

export type PlayerProps = RoomPlayer;

/** Компонент карточки игрока */
export const PlayerCard: FunctionComponent<PlayerProps> = observer(
  ({ id, name, points, color, avatar }) => {
    const avatarConfig = useMemo(() => encodeBase64(avatar), [avatar]);

    return (
      <div id={id} className={classes.wrapper}>
        <PlayerCardLine color={color} />
        <div className={classes.content}>
          <Avatar size={70} config={avatarConfig} />
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
