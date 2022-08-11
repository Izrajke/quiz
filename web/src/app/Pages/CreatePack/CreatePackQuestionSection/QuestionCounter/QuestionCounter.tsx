import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Icon, Tooltip, Typography } from 'components';

import { QuestionTypes } from '../Question';

import classes from './QuestionCounter.module.css';

export interface QuestionCounterProps {
  type: QuestionTypes;
  textAlign?: 'left' | 'right';
  /** Кол-во заполненных вопросов */
  countFilled: number;
  /** Общее кол-во вопросов */
  count: number;
}

export const QuestionCounter: FunctionComponent<QuestionCounterProps> =
  observer(({ countFilled, count, type, textAlign = 'left' }) => {
    const text = useMemo(
      () =>
        type === QuestionTypes.numeric
          ? `Вопросы с ответом-числом ${countFilled}/${count}`
          : `Вопросы с вариантами ответа ${countFilled}/${count}`,
      [type, countFilled, count],
    );

    const style = useMemo(
      () =>
        clsx(
          classes.wrapper,
          textAlign === 'left' ? classes.left : classes.right,
        ),
      [textAlign],
    );

    const tooltipText = useMemo(
      () =>
        type === QuestionTypes.numeric
          ? "У этого типа вопросов ответ должен быть целым положительным числом"
          : "У этого типа вопросов 4 варианта ответа. Нужно заполнить каждый из них и поставить чекбокс справа от верного.",
      [type],
    );

    const TooltipComponent = useCallback(
      () => (
        <Tooltip id={type} tooltipText={tooltipText}>
          <Icon type="info" color="white-50" />
        </Tooltip>
      ),
      [type, tooltipText],
    );

    return (
      <div className={style} style={{ textAlign }}>
        {type === QuestionTypes.withVariants && <TooltipComponent />}
        <Typography.Text color="white" type="text-0" weight="weight-bold">
          {text}
        </Typography.Text>
        {type === QuestionTypes.numeric && <TooltipComponent />}
      </div>
    );
  });

QuestionCounter.displayName = 'QuestionCounter';
