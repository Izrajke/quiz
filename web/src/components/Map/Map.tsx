import type { FunctionComponent } from 'react';

import classes from './Map.module.css';

import type { CellComponent } from './Cell';
import { Cell } from './Cell';
import type { RowComponent } from './Row';
import { Row } from './Row';

/** ------------------------------------------------------------ */
/** Типы */

export interface MapComponent extends FunctionComponent {
  Cell: CellComponent;
  Row: RowComponent;
}

/** Игровая карта */
export const MapComponent: MapComponent = ({ children }) => {
  return <div className={classes.map}>{children}</div>;
};

MapComponent.Cell = Cell;
MapComponent.Row = Row;
MapComponent.displayName = 'Map';
