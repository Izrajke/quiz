import type {
  FunctionComponent,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';

import { observer } from 'mobx-react-lite';

import classes from './Input.module.css';

export interface InputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}

export const Input: FunctionComponent<InputProps> = observer(
  ({ label, ...props }) => {
    return (
      <label className={classes.wrapper}>
        {label}
        <input className={classes.input} {...props} />
      </label>
    );
  },
);

Input.displayName = 'Input';
