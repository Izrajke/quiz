import { useMemo, useRef, useEffect } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import { observer } from 'mobx-react-lite';

import { createAnimationStyle } from 'utils';
import { useStore } from 'store';
import { Typography, Icon } from 'components';

import classes from './RigthAnswerPointer.module.css';

interface RigthAnswerPointerProps {
  maximumPoints: number;
}

export const RigthAnswerPointer: FunctionComponent<RigthAnswerPointerProps> =
  observer(({ maximumPoints }) => {
    const { room } = useStore();

    const calculateLineHeight = useMemo<CSSProperties>(
      () => ({ height: `${room.answerOptions.length * 50}px` }),
      [room.answerOptions.length],
    );

    const animationName = useMemo(() => 'RigthAnswerPointerMargin', []);

    const calculatePointerMargin = useMemo<CSSProperties | undefined>(() => {
      return typeof room.answer === 'number'
        ? {
            marginLeft: `${874 / (maximumPoints / room.answer)}px`,
            animation: `${animationName} 3s ease`,
          }
        : undefined;
    }, [room.answer, maximumPoints, animationName]);

    const animation = useMemo(() => {
      return createAnimationStyle(animationName, 'margin-left', [
        '0px',
        `${874 / (maximumPoints / Number(room.answer))}px`,
      ]);
    }, [room.answer, maximumPoints, animationName]);

    const rightAnswerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rightAnswerContainerRef) {
        rightAnswerContainerRef.current?.appendChild(animation);
      }
    }, [rightAnswerContainerRef, animation]);

    return (
      <div
        className={classes.rightAnswerContainer}
        style={calculatePointerMargin}
        ref={rightAnswerContainerRef}
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

RigthAnswerPointer.displayName = 'RigthAnswerPointer';
