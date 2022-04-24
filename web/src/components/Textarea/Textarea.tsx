import { ReactNode, useMemo } from 'react';
import type { FunctionComponent, TextareaHTMLAttributes } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import classes from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: ReactNode;
}

export const Textarea: FunctionComponent<TextareaProps> = observer(
  ({ className, label, ...props }) => {
    const styles = useMemo(
      () => clsx(classes.textarea, className),
      [className],
    );

    return (
      <div className={classes.root}>
        {label}
        <textarea className={styles} {...props}></textarea>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
