import type { FunctionComponent } from 'react';

import { PlayerColors } from 'store/Sockets/RoomSocket/types';

import clsx from 'clsx';
import { computed } from 'mobx';

import classes from './PlayerCard.module.css';

interface PlayerCardLineProps {
  color: PlayerColors;
}

export const PlayerCardLine: FunctionComponent<PlayerCardLineProps> = ({
  color,
}) => {
  const style = computed(() =>
    clsx(classes.playerLine, classes[`line-${color}`]),
  ).get();
  return <div className={style} />;
};
