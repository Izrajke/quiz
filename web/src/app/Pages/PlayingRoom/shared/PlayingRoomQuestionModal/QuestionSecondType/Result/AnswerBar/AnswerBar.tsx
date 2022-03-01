import { useMemo, useCallback, useRef, useEffect } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { createAnimationStyle } from 'utils';
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

    const animationName = useMemo(() => 'AnswerBarWidth', []);

    const calculatePlayerAnswer = useCallback(
      (playerAnswer: number) => (playerAnswer / maximumPoints) * 100,
      // eslint-disable-next-line
      [maximumPoints],
    );

    const calculateAnswerBarWidth = useCallback(
      (playerAnswer: number) => `${calculatePlayerAnswer(playerAnswer)}%`,
      [calculatePlayerAnswer],
    );

    const textColor = useCallback<(player: PlayerColors) => TypographyColor>(
      (player) => (player === 'player-1' ? 'white' : 'dark-2'),
      [],
    );

    const style = useMemo<CSSProperties>(
      () => ({
        width: calculateAnswerBarWidth(points),
        animation: `${animationName} 3s ease`,
      }),
      [calculateAnswerBarWidth, points, animationName],
    );

    const animation = useMemo(() => {
      return createAnimationStyle(animationName, 'width', [
        '0%',
        `${calculateAnswerBarWidth(points)}px`,
      ]);
    }, [animationName, calculateAnswerBarWidth, points]);

    const rightAnswerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rightAnswerContainerRef) {
        rightAnswerContainerRef.current?.appendChild(animation);
      }
    }, [rightAnswerContainerRef, animation]);

    return (
      <div className={classes.wrapper}>
        <div className={styles} style={style} ref={rightAnswerContainerRef}>
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
