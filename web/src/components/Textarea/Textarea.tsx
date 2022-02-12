import { useMemo } from 'react';
import type { FunctionComponent, TextareaHTMLAttributes } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import classes from './Textarea.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className: string;
}

export const Textarea: FunctionComponent<TextareaProps> = observer(
  ({ className, ...props }) => {
    const styles = useMemo(
      () => clsx(classes.textarea, className),
      [className],
    );
    return <textarea className={styles} {...props}></textarea>;
  },
);

Textarea.displayName = 'Textarea';
