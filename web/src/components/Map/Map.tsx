import type { FunctionComponent } from 'react';

import type { CellData } from 'api';

import classes from './Map.module.css';

import type { ICell } from './Cell';
import { Cell } from './Cell';
import type { IRow } from './Row';
import { Row } from './Row';

/** ------------------------------------------------------------ */
/** Типы */

export interface Cell extends CellData {
  /** Может ли игрок сходить на эту клетку */
  canMove?: boolean;
}

export type Row = Cell[];

export type Map = Row[];

export interface IMap extends FunctionComponent {
  Cell: ICell;
  Row: IRow;
}

/** Игровая карта */
export const Map: IMap = ({ children }) => {
  return <div className={classes.map}>{children}</div>;
};

Map.Cell = Cell;
Map.Row = Row;
Map.displayName = 'Map';
