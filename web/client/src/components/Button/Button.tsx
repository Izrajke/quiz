import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import { Typography } from 'components';

import classes from './Button.module.css';

type TButtonType = 'regular';

interface IButton {
  type: TButtonType;
  onClick: () => void;
  className?: string;
}

export const Button: FunctionComponent<IButton> = observer(
  ({ type, onClick, className, children }) => {
    return (
      <button
        className={clsx(classes.button, classes[type], className)}
        onClick={onClick}
      >
        <Typography.Text color="white" type="text-1">
          {children}
        </Typography.Text>
      </button>
    );
  },
);

Button.displayName = 'Button';
