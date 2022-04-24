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
  wrapperClassName?: string;
  label?: string;
}

export const Select: FunctionComponent<SelectProps> = ({
  options,
  className,
  wrapperClassName,
  label,
  ...props
}) => {
  const style = useMemo(() => clsx(classes.select, className), [className]);
  const wrapperStyle = useMemo(
    () => clsx(classes.root, wrapperClassName),
    [wrapperClassName],
  );

  return (
    <div className={wrapperStyle}>
      {label}
      <select {...props} className={style}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

Select.displayName = 'Select';
