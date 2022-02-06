import type { MapData, PlayerColors } from 'api';

import { MapCellCheck } from './MapCellCheck';

/** Класс со статическими методами работы с картой */
export class MapMoveControl {
  /** Методы првоерки клетки */
  static mapCellCheck = MapCellCheck;

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

  // TODO:
  /** Захват любой пустой клетки (у игрока еще нет захваченныъ клетов) */
  // static checkCanMoveFreeCapture(
  //   mapData: MapData,
  //   rowIndex: number,
  //   cellIndex: number,
  // ) {
  //   const currentCell = mapData[rowIndex][cellIndex];
  //   if (currentCell.owner !== 'empty') {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  // TODO:
  /** Атака пограничных клеток */
  // static checkCanMoveAttack(
  //   mapData: MapData,
  //   rowIndex: number,
  //   cellIndex: number,
  //   player: PlayerColors,
  // ) {
  //   const currentCell = mapData[rowIndex][cellIndex];
  // }
}
