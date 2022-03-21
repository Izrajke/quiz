import { action, makeObservable, observable } from 'mobx';

import { RootStore } from '../RootStore';
import type {
  AnswerOptions,
  TurnQueueData,
  MapData,
  Player,
  PlayerColors,
  SocketAllowedToCaptureData,
  SocketAnswerData,
  SocketMapData,
  SocketOptions,
  SocketPlayersData,
  SocketQuestionData,
  CurrentTurnData,
} from 'api';
import { SocketRequestType, SocketResponseType } from 'api';

import type { CaptureCheckNames } from './classes';
import { MapMoveControl, RoomToastController } from './classes';
import type { Map } from './types/Map';

export class RoomStore {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: SocketOptions = {};
  /** Тип сообщения сокета */
  type: SocketResponseType = 999;
  /** Название вопроса */
  title = '';
  /** Ответ игрока */
  playerAnswer = '';
  /** Ответ на вопрос с сервера */
  answer: string | number = '';
  /** Игроки */
  players: Player[] = [];
  /** Карта */
  map: Map = [];
  /** Модалка вопроса */
  isQuestionModalOpen = false;
  /** Capture статус */
  moveStatus: CaptureCheckNames = 'freeCapture';
  /** Может ли игрок захватывать */
  canCapture = false;
  /** Кол-во клеток для захвата */
  captureCount = 0;
  /** Ответы игроков вопроса типа 2 */
  answerOptions: AnswerOptions[] = [];
  /** Очередь ходов */
  turnQueue: number | PlayerColors[] = 0;
  /** Текущий ход */
  currentTurn = 0;
  /** Кто делает ход (текущий активный игрок) */
  whoseTurn: PlayerColors[] = [];
  /** Контроллер уведомлений */
  toastController: RoomToastController;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      options: observable,
      type: observable,
      title: observable,
      answer: observable,
      players: observable,
      playerAnswer: observable,
      map: observable,
      isQuestionModalOpen: observable,
      canCapture: observable,
      captureCount: observable,
      turnQueue: observable,
      currentTurn: observable,
      whoseTurn: observable,
      // action
      setQuestion: action,
      setAnswer: action,
      setPlayerAnswer: action,
      setPlayers: action,
      resetAnswer: action,
      setMap: action,
      useQuestionModal: action,
      setCaptureCapability: action,
      calculateCaptureCapability: action,
      reduceCaptureCount: action,
      setMoveStatus: action,
      setTurnQueue: action,
      setCurrentTurn: action,
    });
    this.root = root;
    this.toastController = new RoomToastController(this);
  }

  setTurnQueue(data: TurnQueueData) {
    const { type, turns } = data;
    this.type = type;
    this.turnQueue = turns;
  }

  setCurrentTurn(data: CurrentTurnData) {
    this.currentTurn = data.number;
  }

  /** Распарсить данные вопроса, призодящие с сокета */
  setQuestion(questionData: SocketQuestionData) {
    const { question, type } = questionData;
    this.options = question.options || {};
    this.title = question.title;
    this.type = type;
    this.toastController.dismissToast();
  }

  /** Правильный ответ на вопрос */
  setAnswer(answerData: SocketAnswerData) {
    const { options, answer, type } = answerData;
    this.answer = answer.value;
    if (type === SocketResponseType.answerSecondQuestionType && options) {
      this.answerOptions = options;
    }
  }

  /** Сбросить правильный ответ */
  resetAnswer() {
    this.answer = '';
    this.playerAnswer = '';
  }

  setPlayerAnswer(answer = '') {
    this.playerAnswer = answer;
  }

  setPlayers(playersData: SocketPlayersData) {
    const { players } = playersData;
    this.players = players;
  }

  setType(type: SocketResponseType) {
    this.type = type;
  }

  setMap(mapData: SocketMapData) {
    const { map } = mapData;
    this.root.player.color &&
      (this.map = this.mapFormat(map, this.root.player.color));
  }

  useQuestionModal = (value: boolean) => {
    this.isQuestionModalOpen = value;
  };

  setMoveStatus = (newStatus: CaptureCheckNames) => {
    this.moveStatus = newStatus;
  };

  setCaptureCapability = (data: SocketAllowedToCaptureData) => {
    const { color, count } = data;
    this.canCapture = color === this.root.player.color;
    if (this.canCapture) {
      this.captureCount = count;
    }
    this.toastController.dismissToast();
    this.toastController.whoIsCaptureNowToast(color);
  };

  calculateCaptureCapability = () => {
    this.canCapture = !(this.captureCount === 0);
  };

  reduceCaptureCount = () => {
    this.captureCount = --this.captureCount;
    this.calculateCaptureCapability();
  };

  // TODO Подумать куда унести (отдельный класс для сокета)
  getCell = (rowIndex: number, cellIndex: number) => {
    this.root.app.socketMessage({
      type: SocketRequestType.getCell,
      rowIndex,
      cellIndex,
    });
    this.reduceCaptureCount();
  };

  // TODO Подумать куда унести (отдельный класс для сокета)
  attackCell = (rowIndex: number, cellIndex: number) => {
    this.root.app.socketMessage({
      type: SocketRequestType.attackCell,
      rowIndex: rowIndex,
      cellIndex: cellIndex,
    });
  };

  /** Приведение карты к игровому формату (добавление поля canMove)  */
  mapFormat = (mapData: MapData, player: PlayerColors): Map =>
    mapData.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const moveControl = new MapMoveControl(
          mapData,
          rowIndex,
          cellIndex,
          player,
        );
        return {
          ...cell,
          canMove: moveControl.checks[this.moveStatus](),
        };
      }),
    );
}
