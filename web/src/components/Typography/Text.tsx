import { FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';

import type { TypographyColor } from './Typography';

import classes from './Typography.module.css';

export type TextType = 'caption' | 'text-0' | 'text-1' | 'text-2' | 'text-3';
export type TextWeight = 'weight-bold' | 'weight-regular';

export interface TextProps {
  color: TypographyColor;
  type: TextType;
  className?: string;
  weight?: TextWeight;
}

export interface TextComponent extends FunctionComponent<TextProps> {
  displayName: string;
}

export const Text: TextComponent = ({
  color,
  className,
  type,
  weight = 'weight-regular',
  children,
}) => {
  const styles = useMemo(
    () => clsx(classes[color], classes[type], classes[weight], className),
    [className, color, type, weight],
  );
  return <div className={styles}>{children}</div>;
};

Text.displayName = 'Text';
