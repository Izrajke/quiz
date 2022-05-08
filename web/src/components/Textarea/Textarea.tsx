import { ReactNode, useMemo, forwardRef, ForwardedRef } from 'react';
import type { FunctionComponent, TextareaHTMLAttributes } from 'react';

import clsx from 'clsx';

import classes from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: ReactNode;
  ref?: ForwardedRef<HTMLTextAreaElement>;
}

export const Textarea: FunctionComponent<TextareaProps> = forwardRef(
  ({ className, label, ...props }, ref) => {
    const styles = useMemo(
      () => clsx(classes.textarea, className),
      [className],
    );

    return (
      <div className={classes.root}>
        {label}
        <textarea className={styles} ref={ref} {...props} />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
