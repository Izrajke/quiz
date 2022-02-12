import { CellData } from 'api';

export interface Cell extends CellData {
  /** Может ли игрок сходить на эту клетку */
  canMove: boolean;
}

export type Row = Cell[];

export type Map = Row[];
