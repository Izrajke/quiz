import { RoomCellData } from 'store/Sockets/RoomSocket/types';

export interface Cell extends RoomCellData {
  /** Может ли игрок сходить на эту клетку */
  canMove: boolean;
}

export type Row = Cell[];

export type Map = Row[];
