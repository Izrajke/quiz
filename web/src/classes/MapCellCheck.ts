import type { MapData, PlayerColors } from 'api';

/** Класс со статическими методами проверки клетки на доступность хода */
export class MapCellCheck {
  /** Проверка клеток */
  static checkBorderCells(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
  ) {
    return (
      this.checkHorizontalCells(mapData, rowIndex, cellIndex, player) ||
      this.checkVerticalCells(mapData, rowIndex, cellIndex, player, 'top') ||
      this.checkVerticalCells(mapData, rowIndex, cellIndex, player, 'bottom')
    );
  }

  /** Проверка клеток по краям  */
  static checkHorizontalCells = (
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
  ) =>
    mapData[rowIndex][cellIndex - 1]?.owner === player ||
    mapData[rowIndex][cellIndex + 1]?.owner === player;

  /** Проверка клеток по вертикали */
  static checkVerticalCells(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
    direction: 'top' | 'bottom',
  ) {
    const isEvenRow = rowIndex % 2 === 0;
    const checkingRowIndex = direction === 'top' ? rowIndex - 1 : rowIndex + 1;
    if (mapData[checkingRowIndex]) {
      if (!isEvenRow) {
        return (
          mapData[checkingRowIndex][cellIndex - 1]?.owner === player ||
          mapData[checkingRowIndex][cellIndex]?.owner === player
        );
      } else {
        return (
          mapData[checkingRowIndex][cellIndex]?.owner === player ||
          mapData[checkingRowIndex][cellIndex + 1]?.owner === player
        );
      }
    } else {
      return false;
    }
  }
}
