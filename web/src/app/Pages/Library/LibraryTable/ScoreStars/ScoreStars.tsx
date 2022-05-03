import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Icon } from 'components';

import classes from './ScoreStars.module.css';

export const MAX_STARS_IN_LIBRARY_TABLE = 5;

export interface ScoreStarsProps {
  score: number;
}

export const ScoreStars: FunctionComponent<ScoreStarsProps> = observer(
  ({ score }) => {
    const starsRenderArray = useMemo(
      () =>
        new Array(MAX_STARS_IN_LIBRARY_TABLE)
          .fill(0)
          .map((_, index) => (index++ < score ? 1 : 0)),
      [score],
    );

    return (
      <div className={classes.wrapper}>
        {starsRenderArray.map((star) =>
          star ? (
            <Icon type="starFilled" color="gold" size={20} />
          ) : (
            <Icon type="starOutline" color="gold-50" size={20} />
          ),
        )}
      </div>
    );
  },
);

ScoreStars.displayName = 'ScoreStars';
