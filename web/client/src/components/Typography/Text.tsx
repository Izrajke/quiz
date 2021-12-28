import { FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';

import type { ITypographyColor } from './Typography';

import classes from './Typography.module.css';

export type ITextType = 'text-1' | 'text-2';

export interface ITextProps {
  color: ITypographyColor;
  type: ITextType;
  className?: string;
}

export interface IText extends FunctionComponent<ITextProps> {}

export const Text: IText = ({ color, className, type, children }) => {
  const styles = useMemo(
    () => clsx(classes[color], classes[type], className),
    [className],
  );
  return <div className={styles}>{children}</div>;
};

Text.displayName = 'Text';
