import type { FunctionComponent } from 'react';

import classes from './Map.module.css';

import type { ICell } from './Cell';
import { Cell } from './Cell';
import type { IRow } from './Row';
import { Row } from './Row';

/** ------------------------------------------------------------ */
/** Типы */

export type TOwner = 'player-1' | 'player-2' | 'player-3' | null;

export interface ICellData {
  owner: TOwner;
}

export type TRow = ICellData[];

export type TMap = TRow[];

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
