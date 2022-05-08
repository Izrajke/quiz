import { useMemo, useCallback } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useAnimation } from 'utils';
import type { PlayerColors } from 'store/Sockets/RoomSocket/types';
import type { TypographyColor } from 'components';

import { AnswerText } from './AnswerText';

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

    const percentageOfMaximum = useMemo(
      () => (points / maximumPoints) * 100,
      [points, maximumPoints],
    );

    const calculateAnswerBarWidth = useCallback(
      () => `${percentageOfMaximum}%`,
      [percentageOfMaximum],
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
        <div
          className={styles}
          style={style}
          ref={elementRef}
          data-testid="AnswerBar"
        >
          <div className={classes.textContainer}>
            {percentageOfMaximum >= 20 && (
              <AnswerText
                color={textColor(player)}
                time={time}
                points={points}
              />
            )}
          </div>
        </div>
        {percentageOfMaximum < 20 && (
          <AnswerText
            color={'white'}
            time={time}
            points={points}
            position={'outside'}
          />
        )}
      </div>
    );
  },
);

AnswerBar.displayName = 'AnswerBar';
