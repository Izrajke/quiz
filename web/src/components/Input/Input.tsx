import type {
  FunctionComponent,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';
import { useMemo } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Input.module.css';

export interface InputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  label?: string;
  disabled?: boolean;
}

export const Input: FunctionComponent<InputProps> = observer(
  ({ label, className, disabled, ...props }) => {
    const styles = useMemo(() => clsx(classes.wrapper, className), [className]);

    return (
      <label className={styles}>
        {label}
        <input disabled={disabled} className={classes.input} {...props} />
      </label>
    );
  },
);

Input.displayName = 'Input';
