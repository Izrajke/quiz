import { useMemo, createElement } from 'react';
import type { FunctionComponent, CSSProperties } from 'react';

import clsx from 'clsx';

import { ReactComponent as Cog } from './svg/Cog.svg';

import classes from './Icon.module.css';

const icons = {
  cog: Cog,
};

export type IconTypes = keyof typeof icons;

export type IconColors = 'white';

export interface IconProps {
  type: IconTypes;
  className?: string;
  color?: IconColors;
  size?: number;
}

export const Icon: FunctionComponent<IconProps> = ({
  type,
  className,
  color = 'white',
  size,
  ...props
}) => {
  const style = useMemo<CSSProperties>(
    () => ({
      width: size,
      height: size,
    }),
    [size],
  );
  return (
    <span {...props} className={clsx(classes.icon, className)}>
      {createElement(icons[type], { className: classes[color], style })}
    </span>
  );
};

Icon.displayName = 'Icon';
