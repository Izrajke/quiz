import { useMemo } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import { observer } from 'mobx-react-lite';

import { useAnimation } from 'utils';
import { useStore } from 'store';
import { Typography, Icon } from 'components';

import classes from './RigthAnswerPointer.module.css';

interface RightAnswerPointerProps {
  maximumPoints: number;
}

export const RightAnswerPointer: FunctionComponent<RightAnswerPointerProps> =
  observer(({ maximumPoints }) => {
    const { room } = useStore();

    const leftMargin = useMemo(
      () => `${874 / (maximumPoints / Number(room.answer))}px`,
      [maximumPoints, room.answer],
    );

    const { elementRef, animationStyle } = useAnimation(
      'RightAnswerPointerMargin',
      {
        context: 'margin-left',
        params: ['0px', leftMargin],
      },
    );

    const calculatePointerMargin = useMemo<CSSProperties | undefined>(() => {
      return typeof room.answer === 'number'
        ? {
            marginLeft: leftMargin,
            ...animationStyle,
          }
        : undefined;
    }, [room.answer, animationStyle, leftMargin]);

    const calculateLineHeight = useMemo<CSSProperties>(
      () => ({ height: `${room.answerOptions.length * 50}px` }),
      [room.answerOptions.length],
    );

    return (
      <div
        className={classes.rightAnswerContainer}
        style={calculatePointerMargin}
        ref={elementRef}
      >
        <Typography.Text
          className={classes.rightAnswerText}
          color="white-70"
          type="caption"
        >
          Правильный ответ:
        </Typography.Text>
        <div className={classes.pointerContainer}>
          <Typography.Text color="white" type="text-1" weight="weight-bold">
            {room.answer || '???'}
          </Typography.Text>
          <Icon type="pointer" className={classes.icon} />
          <div className={classes.line} style={calculateLineHeight} />
        </div>
      </div>
    );
  });

RightAnswerPointer.displayName = 'RightAnswerPointer';
