import { FunctionComponent, useMemo } from 'react';

import clsx from 'clsx';

import type { TypographyColor } from './Typography';
import classes from './Typography.module.css';

export type TextType =
  | 'caption'
  | 'caption-1'
  | 'caption-2'
  | 'text-0'
  | 'text-1'
  | 'text-2'
  | 'text-3';

export type TextWeight = 'weight-bold' | 'weight-regular';

export type TextOpacity = 'opacity-50' | 'opacity-100';

export interface TextProps {
  color: TypographyColor;
  type: TextType;
  className?: string;
  weight?: TextWeight;
  opacity?: TextOpacity;
}

export interface TextComponent extends FunctionComponent<TextProps> {
  displayName: string;
}

export const Text: TextComponent = ({
  color,
  className,
  type,
  weight = 'weight-regular',
  opacity = 'opacity-100',
  children,
}) => {
  const styles = useMemo(
    () =>
      clsx(
        classes[color],
        classes[type],
        classes[weight],
        classes[opacity],
        classes.lh,
        className,
      ),
    [className, color, type, weight, opacity],
  );
  return <div className={styles}>{children}</div>;
};

Text.displayName = 'Text';
