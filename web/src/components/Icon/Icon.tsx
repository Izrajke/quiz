import { useMemo, createElement } from 'react';
import type {
  FunctionComponent,
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';

import clsx from 'clsx';

import { ReactComponent as Cog } from './svg/Cog.svg';
import { ReactComponent as Pointer } from './svg/Pointer.svg';
import { ReactComponent as Check } from './svg/Check.svg';

import classes from './Icon.module.css';

const icons = {
  cog: Cog,
  pointer: Pointer,
  check: Check,
};

export type IconTypes = keyof typeof icons;

export type IconColors = 'white';

export interface IconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
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
