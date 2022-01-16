import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import classes from './Map.module.css';

export interface ICellProps {
  className?: string;
  owner: string | null;
}

export interface ICell extends FunctionComponent<ICellProps> {
  displayName?: string;
}

/** Клетка на поле */
export const Cell: ICell = observer(({ className, owner }) => {
  const styles = useMemo(
    () => clsx(className, classes.hex, owner && classes[owner]),
    [className, owner],
  );
  const clickHandle = () => {
    console.log(1);
  };
  return (
    <svg className={styles} width="88" height="100" viewBox="0 0 88 100">
      <path
        onClick={clickHandle}
        d="M43.3013 0L86.6025 25V75L43.3013 100L0 75V25L43.3013 0Z"
      />
    </svg>
  );
});

Cell.displayName = 'Cell';
