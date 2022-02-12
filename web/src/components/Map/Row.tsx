import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import classes from './Map.module.css';

export interface RowProps {
  rowIndex: number;
}

export interface RowComponent extends FunctionComponent<RowProps> {
  displayName?: string;
}

/** Линия ячеек игрового поля */
export const Row: RowComponent = ({ children, rowIndex }) => {
  const isEven = useMemo(() => rowIndex % 2 === 0, [rowIndex]);

  const styles = useMemo(
    () =>
      clsx(
        classes.row,
        isEven && classes.evenRow,
        rowIndex !== 0 && classes.topMarginRow,
      ),
    [isEven, rowIndex],
  );

  return <div className={styles}>{children}</div>;
};

Row.displayName = 'Row';
