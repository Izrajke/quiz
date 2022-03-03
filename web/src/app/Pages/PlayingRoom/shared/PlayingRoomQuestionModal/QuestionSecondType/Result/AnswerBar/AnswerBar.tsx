import { useMemo, useCallback } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useAnimation } from 'utils';
import type { PlayerColors } from 'api';
import { Typography } from 'components';
import type { TypographyColor } from 'components';

import classes from './AnswerBar.module.css';

export interface AnswerBarProps {
  maximumPoints: number;
  player: PlayerColors;
  points: number;
  time: number;
}

/** Полоска ответа игрока */
export const AnswerBar: FunctionComponent<AnswerBarProps> = observer(
  ({ player, points, time, maximumPoints }) => {
    const styles = useMemo(() => clsx(classes.bar, classes[player]), [player]);

    const calculateAnswerBarWidth = useCallback(
      () => `${(points / maximumPoints) * 100}%`,
      [points, maximumPoints],
    );

    const { elementRef, animationStyle } = useAnimation('AnswerBarWidth', {
      context: 'width',
      params: ['0%', `${calculateAnswerBarWidth()}%`],
    });

    const textColor = useCallback<(player: PlayerColors) => TypographyColor>(
      (player) => (player === 'player-1' ? 'white' : 'dark-2'),
      [],
    );

    const style = useMemo<CSSProperties>(
      () => ({
        width: calculateAnswerBarWidth(),
        ...animationStyle,
      }),
      [calculateAnswerBarWidth, animationStyle],
    );

    return (
      <div className={classes.wrapper}>
        <div className={styles} style={style} ref={elementRef}>
          <div className={classes.textContainer}>
            <Typography.Text
              className={classes.points}
              type="text-0"
              color={textColor(player)}
              weight="weight-bold"
            >
              {points}
            </Typography.Text>
            <Typography.Text type="caption" color={textColor(player)}>
              {`${time} c.`}
            </Typography.Text>
          </div>
        </div>
      </div>
    );
  },
);

AnswerBar.displayName = 'AnswerBar';
