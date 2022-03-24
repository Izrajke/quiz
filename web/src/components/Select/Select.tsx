import { useMemo } from 'react';
import type {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
} from 'react';

import clsx from 'clsx';

import classes from './Select.module.css';

export interface SelectProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: string[] | number[];
  className?: string;
}

export const Select: FunctionComponent<SelectProps> = ({
  options,
  className,
  ...props
}) => {
  const style = useMemo(() => clsx(classes.select, className), [className]);

  return (
    <select {...props} className={style}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
};

Select.displayName = 'Select';
