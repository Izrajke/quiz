import type { FunctionComponent } from 'react';
import clsx from 'clsx';

import { computed } from 'mobx';
import { PlayerColors } from 'api';

import classes from './PlayerCard.module.css';

interface PlyerCardLineProps {
  color: PlayerColors;
}

export const PlyerCardLine: FunctionComponent<PlyerCardLineProps> = ({
  color,
}) => {
  const style = computed(() =>
    clsx(classes.playerLine, classes[`line-${color}`]),
  ).get();
  return <div className={style}></div>;
};
