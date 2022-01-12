import { FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';

import type { ITypographyColor } from './Typography';

import classes from './Typography.module.css';

export type TTextType = 'text-1' | 'text-2' | 'text-3';
export type TTextWeight = 'weight-bold' | 'weight-regular';

export interface ITextProps {
  color: ITypographyColor;
  type: TTextType;
  className?: string;
  weight?: TTextWeight;
}

export interface IText extends FunctionComponent<ITextProps> {
  displayName: string;
}

export const Text: IText = ({
  color,
  className,
  type,
  weight = 'text-regular',
  children,
}) => {
  const styles = useMemo(
    () => clsx(classes[color], classes[type], classes[weight], className),
    [className, color, type, weight],
  );
  return <div className={styles}>{children}</div>;
};

Text.displayName = 'Text';
