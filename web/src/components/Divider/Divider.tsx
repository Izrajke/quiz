import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import clsx from 'clsx';

import classes from './Divider.module.css';

interface DividerProps {
  className?: string;
}

export const Divider: FunctionComponent<DividerProps> = ({ className }) => {
  const style = useMemo(() => clsx(classes.divider, className), [className]);
  return <div className={style}></div>;
};

Divider.displayName = 'Divider';
