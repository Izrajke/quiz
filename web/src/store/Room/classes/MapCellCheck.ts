import type { MapData, PlayerColors } from 'api';

import type { MapMoveControl } from './MapMoveControl';

/** Класс со статическими методами проверки клетки на доступность хода */
export class MapCellCheck {
  mapData: MapData;
  rowIndex: number;
  cellIndex: number;
  player: PlayerColors;

  constructor(mapMoveControl: MapMoveControl) {
    this.mapData = mapMoveControl.mapData;
    this.rowIndex = mapMoveControl.rowIndex;
    this.cellIndex = mapMoveControl.cellIndex;
    this.player = mapMoveControl.player;
  }

  /** Проверка клеток */
  public checkBorderCells() {
    return (
      this.checkHorizontalCells() ||
      this.checkVerticalCells('top') ||
      this.checkVerticalCells('bottom')
    );
  }

  /** Проверка клеток по краям  */
  private checkHorizontalCells() {
    return (
      this.mapData[this.rowIndex][this.cellIndex - 1]?.owner === this.player ||
      this.mapData[this.rowIndex][this.cellIndex + 1]?.owner === this.player
    );
  }

  /** Проверка клеток по вертикали */
  private checkVerticalCells(direction: 'top' | 'bottom') {
    const isEvenRow = this.rowIndex % 2 === 0;
    const checkingRowIndex =
      direction === 'top' ? this.rowIndex - 1 : this.rowIndex + 1;

    if (this.mapData[checkingRowIndex]) {
      if (!isEvenRow) {
        return (
          this.mapData[checkingRowIndex][this.cellIndex - 1]?.owner ===
            this.player ||
          this.mapData[checkingRowIndex][this.cellIndex]?.owner === this.player
        );
      } else {
        return (
          this.mapData[checkingRowIndex][this.cellIndex]?.owner ===
            this.player ||
          this.mapData[checkingRowIndex][this.cellIndex + 1]?.owner ===
            this.player
        );
      }
    } else {
      return false;
    }
  }
}
