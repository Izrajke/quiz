import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Typography } from 'components';
import type { TypographyColor } from 'components';

import classes from './AnswerText.module.css';

type AnswerTextPosition = 'inside' | 'outside';

interface AnswerTextProps {
  color: TypographyColor;
  points: number;
  time: number;
  position?: AnswerTextPosition;
}

export const AnswerText: FunctionComponent<AnswerTextProps> = observer(
  ({ color, points, time, position = 'inside' }) => {
    const style = useMemo(
      () => clsx(classes.textContainer, classes[position]),
      [position],
    );
    return (
      <div className={style}>
        <Typography.Text
          className={classes.points}
          type="text-0"
          color={color}
          weight="weight-bold"
        >
          {points}
        </Typography.Text>
        <Typography.Text
          className={classes.time}
          type="caption-2"
          color={color}
          opacity="opacity-50"
        >
          {`${time} c`}
        </Typography.Text>
      </div>
    );
  },
);

AnswerText.displayName = 'AnswerText';
