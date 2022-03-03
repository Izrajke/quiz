import type { MapData, PlayerColors } from 'api';

import { MapCellCheck } from './MapCellCheck';

/** Функция проверки возможности хода на клетку */
type CaptureCheck = () => boolean;

export interface CaptureChecks {
  /** Захват свободных клеток */
  capture: CaptureCheck;
  /** Захват любой свободной клетки */
  freeCapture: CaptureCheck;
  /** Атака клеток оппонента */
  attack: CaptureCheck;
}

export type CaptureCheckNames = keyof CaptureChecks;

export interface MapControl {
  mapData: MapData;
  rowIndex: number;
  cellIndex: number;
  player: PlayerColors;
}

/** Класс со статическими методами работы с картой */
export class MapMoveControl implements MapControl {
  mapData: MapData;
  rowIndex: number;
  cellIndex: number;
  player: PlayerColors;

  /** Методы првоерки клетки */
  private mapCellCheck: MapCellCheck;

  /** Объект проверок на разные условия */
  public checks: CaptureChecks = {
    capture: this.checkCanMoveCapture.bind(this),
    freeCapture: this.checkCanMoveFreeCapture.bind(this),
    attack: this.checkCanMoveAttack.bind(this),
  };

  constructor(
    mapData: MapData,
    rowIndex: number,
    cellIndex: number,
    player: PlayerColors,
  ) {
    this.mapData = mapData;
    this.rowIndex = rowIndex;
    this.cellIndex = cellIndex;
    this.player = player;
    this.mapCellCheck = new MapCellCheck(this);
  }

  /** Захват пограничных клеток */
  private checkCanMoveCapture(): boolean {
    const currentCell = this.mapData[this.rowIndex][this.cellIndex];
    return currentCell.owner !== 'empty'
      ? false
      : this.mapCellCheck.checkBorderCells();
  }

  /** Захват любой пустой клетки (у игрока еще нет захваченныъ клетов) */
  private checkCanMoveFreeCapture() {
    const currentCell = this.mapData[this.rowIndex][this.cellIndex];
    return currentCell.owner === 'empty';
  }

  /** Атака пограничных клеток */
  private checkCanMoveAttack() {
    const currentCell = this.mapData[this.rowIndex][this.cellIndex];
    return currentCell.owner === this.player
      ? false
      : currentCell.isExists && this.mapCellCheck.checkBorderCells();
  }
}
