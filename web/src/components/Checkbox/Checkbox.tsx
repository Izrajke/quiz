import { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import { Icon } from 'components';

import classes from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'className'
  > {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
}

export const Checkbox: FunctionComponent<CheckboxProps> = observer(
  ({ className, checked = false, disabled, onChange, ...props }) => {
    const styles = useMemo(
      () => clsx(classes.checkBox, className),
      [className],
    );

    return (
      <label className={classes.label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={classes.checkInput}
          disabled={disabled}
          {...props}
        />
        <span className={styles}>
          {checked && (
            <Icon type="check" className={classes.checkIcon} size={16} />
          )}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
