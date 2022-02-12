import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { SocketRequestType } from 'api';
import type { CellData } from 'api';

import classes from './Map.module.css';

export interface CellProps extends CellData {
  className?: string;
  canMove?: boolean;
  /** Индексы матрицы клеток */
  rowIndex: number;
  cellIndex: number;
}

export interface CellComponent extends FunctionComponent<CellProps> {
  displayName?: string;
}

/** Клетка на поле */
export const Cell: CellComponent = observer(
  ({ className, isExists, owner, rowIndex, cellIndex, canMove }) => {
    const { app, player } = useStore();

    const styles = useMemo(
      () =>
        clsx(
          className,
          classes.cell,
          isExists && owner && classes[owner],
          canMove
            ? `${classes[`canMove-${player.color}`]}  ${classes.pointer}`
            : classes.notAllowed,
        ),
      [className, isExists, owner, canMove, player.color],
    );

    /** Отправляем сообщение о получении или о захвате клетки */
    const clickHandle = () => {
      app.socketMessage({
        type: SocketRequestType.getCell,
        rowIndex: rowIndex,
        cellIndex: cellIndex,
      });
    };

    // TODO Завязка на isExists пока не доработана логика нападения на противника
    return (
      <svg width="88" height="100" viewBox="0 0 88 100">
        <path
          className={styles}
          onClick={isExists && canMove ? clickHandle : undefined}
          d="M43.3013 0L86.6025 25V75L43.3013 100L0 75V25L43.3013 0Z"
        />
      </svg>
    );
  },
);

Cell.displayName = 'Cell';
