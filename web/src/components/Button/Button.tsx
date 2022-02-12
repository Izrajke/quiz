import { FunctionComponent, useMemo } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Button.module.css';

type ButtonType = 'regular' | 'primary';
type ButtonSize = 'normal' | 'large' | 'small';

export interface ButtonProps {
  /** Тип кнопки */
  type: ButtonType;
  /** Обработчик нажатия */
  onClick: () => void;
  /** Стили */
  className?: string;
  /** Размер */
  size?: ButtonSize;
  /** Текст внутри */
  text?: string;
  /** Задизейблена ли кнопка */
  disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = observer(
  ({
    type,
    onClick,
    className,
    size = 'normal',
    children,
    text,
    disabled = false,
  }) => {
    const styles = useMemo(
      () => clsx(classes.button, classes[type], classes[size], className),
      [className, type, size],
    );

    return (
      <button className={styles} onClick={onClick} disabled={disabled}>
        {text || children}
      </button>
    );
  },
);

Button.displayName = 'Button';
