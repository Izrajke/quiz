import { FunctionComponent, useMemo } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Button.module.css';

type TButtonType = 'regular' | 'disabled' | 'primary';
type TButtonSize = 'normal' | 'large' | 'small';

interface IButton {
  type: TButtonType;
  onClick: () => void;
  className?: string;
  size?: TButtonSize;
}

export const Button: FunctionComponent<IButton> = observer(
  ({ type, onClick, className, size = 'normal', children }) => {
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
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
