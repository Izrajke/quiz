import type { MapData, PlayerColors } from 'api';

import { MapCellCheck } from './MapCellCheck';

/** Функция проверки возможности хода на клетку */
type CaptureCheck = (
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
) => boolean;

export interface CaptureChecks {
  /** Захват свободных клеток */
  capture: CaptureCheck;
  /** Захват любой свободной клетки */
  freeCapture: CaptureCheck;
  /** Атака клеток оппонента */
  attack: CaptureCheck;
}

export type CaptureCheckNames = keyof CaptureChecks;

/** Класс со статическими методами работы с картой */
export class MapMoveControl {
  /** Методы првоерки клетки */
  static mapCellCheck = MapCellCheck;

  /** Объект проверок на разные условия */
  static checks: CaptureChecks = {
    capture: this.checkCanMoveCapture.bind(MapMoveControl),
    freeCapture: this.checkCanMoveFreeCapture.bind(MapMoveControl),
    attack: this.checkCanMoveAttack.bind(MapMoveControl),
  };

  /** Захват пограничных клеток */
  static checkCanMoveCapture(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
  ): boolean {
    const currentCell = mapData[rowIndex][cellIndex];
    return currentCell.owner !== 'empty'
      ? false
      : this.mapCellCheck.checkBorderCells(
          mapData,
          rowIndex,
          cellIndex,
          player,
        );
  }

  /** Захват любой пустой клетки (у игрока еще нет захваченныъ клетов) */
  static checkCanMoveFreeCapture(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
  ) {
    const currentCell = mapData[rowIndex][cellIndex];
    return currentCell.owner !== 'empty' ? false : true;
  }

  /** Атака пограничных клеток */
  static checkCanMoveAttack(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
  ) {
    const currentCell = mapData[rowIndex][cellIndex];
    return currentCell.owner === player
      ? false
      : currentCell.isExists &&
          this.mapCellCheck.checkBorderCells(
            mapData,
            rowIndex,
            cellIndex,
            player,
          );
  }
}
