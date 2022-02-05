import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '../RootStore';
import type {
  TSocketResponseType,
  ISocketOptions,
  ISocketQuestionData,
  ISocketAnswerData,
  ISocketPlayersData,
  IPlayer,
  MapData,
  PlayerColors,
} from 'api';
import type { Map } from 'components';
import type { SocketMapData } from 'api';

/** Тип статуса игры */
export type TStatus = 'question';

export class RoomState {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: ISocketOptions = {};
  /** Тип вопроса */
  type: TSocketResponseType = 999;
  /** Название вопроса */
  title = '';
  /** Статус игры */
  status: TStatus = 'question';
  /** Ответ игрока */
  playerAnswer = '';
  /** Ответ на вопрос с сервера */
  answer = '';
  /** Игроки */
  players: IPlayer[] = [];
  /** Карта */
  map: Map = [];
  /** Модалка вопроса */
  isQuestionModalOpen = false;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      options: observable,
      type: observable,
      title: observable,
      answer: observable,
      players: observable,
      map: observable,
      isQuestionModalOpen: observable,
      // action
      setQuestion: action,
      setAnswer: action,
      setPlayers: action,
      resetAnswer: action,
      setMap: action,
      useQuetionModal: action,
    });
    this.root = root;
  }

  /** Распарсить данные вопроса, призодящие с сокета */
  setQuestion(questionData: ISocketQuestionData) {
    const { question, type } = questionData;
    this.options = question.options;
    this.title = question.title;
    this.type = type;
  }

  setAnswer(answerData: ISocketAnswerData) {
    const { answer, type } = answerData;
    this.answer = answer.value;
    this.type = type;
  }

  resetAnswer() {
    this.answer = '';
  }

  setPlayers(playersData: ISocketPlayersData) {
    const { players } = playersData;
    this.players = players;
  }

  setType(type: TSocketResponseType) {
    this.type = type;
  }

  setMap(mapData: SocketMapData) {
    const { map } = mapData;
    if (this.root.player.color) {
      console.log(this.root.player.color);
      this.map = mapFormat(map, this.root.player.color);
    }
    console.log(JSON.parse(JSON.stringify(this.map)));
  }

  useQuetionModal = (value: boolean) => {
    this.isQuestionModalOpen = value;
  };
}

function mapFormat(mapData: MapData, player: PlayerColors): Map {
  const result = mapData.map((row, rowIndex) =>
    row.map((cell, cellIndex) => {
      return {
        ...cell,
        canMove: checkCanMoveCapture(mapData, rowIndex, cellIndex, player),
      };
    }),
  );
  console.log(result);
  return result;
}

// FreeCapture - захват любой пустой клетки (у игрока еще нет захваченныъ клетов),
// Capture - захват пограничных клеток,
// Attack - захват чужой клетки

// function checkCanMoveAttack(
//   mapData: MapData,
//   rowIndex: number,
//   cellIndex: number,
//   player: PlayerColors,
// ) {
//   const currentCell = mapData[rowIndex][cellIndex];
// }

function checkBorderCells(
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
) {
  return (
    checkLeftRigth(mapData, rowIndex, cellIndex, player) &&
    checkTop(mapData, rowIndex, cellIndex, player) &&
    checkBottom(mapData, rowIndex, cellIndex, player)
  );
}

//
function checkLeftRigth(
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
): boolean {
  if (
    mapData[rowIndex][cellIndex - 1]?.owner === player ||
    mapData[rowIndex][cellIndex + 1]?.owner === player
  ) {
    console.log('дошел до сюда');
    return true;
  } else {
    return false;
  }
}

function checkTop(
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
) {
  const isEvenRow = rowIndex % 2 === 0;
  if (!isEvenRow) {
    if (
      mapData[rowIndex - 1][cellIndex - 1]?.owner === player ||
      mapData[rowIndex - 1][cellIndex]?.owner === player
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      mapData[rowIndex - 1][cellIndex]?.owner === player ||
      mapData[rowIndex - 1][cellIndex + 1]?.owner === player
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function checkBottom(
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
) {
  const isEvenRow = rowIndex % 2 === 0;
  if (mapData[rowIndex + 1]) {
    if (!isEvenRow) {
      if (
        mapData[rowIndex + 1][cellIndex - 1]?.owner === player ||
        mapData[rowIndex + 1][cellIndex]?.owner === player
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        mapData[rowIndex + 1][cellIndex]?.owner === player ||
        mapData[rowIndex + 1][cellIndex + 1]?.owner === player
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
}

/** Capture */
function checkCanMoveCapture(
  mapData: MapData,
  rowIndex: number,
  cellIndex: number,
  player: PlayerColors,
): boolean {
  const currentCell = mapData[rowIndex][cellIndex];
  if (currentCell.owner !== 'empty') {
    return false;
  } else if (!checkBorderCells(mapData, rowIndex, cellIndex, player)) {
    return false;
  } else {
    return true;
  }
}

/** FreeCapture */
// function checkCanMoveFreeCapture(
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
