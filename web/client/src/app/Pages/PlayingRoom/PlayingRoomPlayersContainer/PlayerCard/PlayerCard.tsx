import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Typography } from 'components';

import classes from './PlayerCard.module.css';

export const PlayerCard: FunctionComponent = observer(() => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.playerLine}></div>
      <div className={classes.content}>
        <img
          className={classes.avatar}
          src="https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg"
        />
        <div className={classes.textContainer}>
          <Typography.Text color="white-70" type="text-1">
            KioKEeen
          </Typography.Text>
          <Typography.Text color="white" type="text-3" weight="weight-bold">
            1 000 000
          </Typography.Text>
        </div>
      </div>
    </div>
  );
});

PlayerCard.displayName = 'PlayerCard';
