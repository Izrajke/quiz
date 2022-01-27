import { FunctionComponent, useMemo } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Button.module.css';

type ButtonType = 'regular' | 'disabled' | 'primary';
type ButtonSize = 'normal' | 'large' | 'small';

export interface ButtonProps {
  type: ButtonType;
  onClick: () => void;
  className?: string;
  size?: ButtonSize;
  text?: string;
}

export const Button: FunctionComponent<ButtonProps> = observer(
  ({ type, onClick, className, size = 'normal', children, text }) => {
    const styles = useMemo(
      () => clsx(classes.button, classes[type], classes[size], className),
      [className, type, size],
    );

    return (
      <button
        className={styles}
        onClick={onClick}
        disabled={type === 'disabled'}
      >
        {text || children}
      </button>
    );
  },
);

Button.displayName = 'Button';
