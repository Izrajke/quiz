import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import classes from './Map.module.css';

export interface IRowProps {
  rowNumber: number;
}

export interface IRow extends FunctionComponent<IRowProps> {
  displayName?: string;
}

/** Линия ячеек игрового поля */
export const Row: IRow = ({ children, rowNumber }) => {
  const isEven = useMemo(() => rowNumber % 2 === 0, [rowNumber]);

  const styles = useMemo(
    () =>
      clsx(
        classes.row,
        isEven && classes.evenRow,
        rowNumber !== 0 && classes.topMarginRow,
      ),
    [isEven, rowNumber],
  );

  return <div className={styles}>{children}</div>;
};

Row.displayName = 'Row';
