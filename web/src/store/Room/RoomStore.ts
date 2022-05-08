import { action, computed, makeObservable, observable } from 'mobx';

import { RootStore } from '../RootStore';
import type {
  RoomAnswerOptions,
  RoomCurrentTurnData,
  RoomMapData,
  RoomPlayer,
  PlayerColors,
  RoomSocketAllowedToCaptureData,
  RoomSocketAnswerData,
  SocketMapData,
  RoomSocketOptions,
  RoomSocketPlayersData,
  SocketQuestionData,
  RoomTurnQueueData,
} from 'store/Sockets/RoomSocket/types';
import {
  RoomSocketRequestType,
  RoomSocketResponseType,
} from 'store/Sockets/RoomSocket/types';

import type { CaptureCheckNames } from './classes';
import { MapMoveControl, RoomToastController } from './classes';
import type { Map } from './types/Map';

export class RoomStore {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: RoomSocketOptions = {};
  /** Тип сообщения сокета */
  type: RoomSocketResponseType = 999;
  /** Название вопроса */
  title = '';
  /** Ответ игрока */
  playerAnswer = '';
  /** Ответ на вопрос с сервера */
  answer: string | number = '';
  /** Игроки */
  players: RoomPlayer[] = [];
  /** Данные о карте с сервера */
  mapData: RoomMapData = [];
  /** Отформатированная карта */
  get map(): Map {
    return this.mapData.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const moveControl = new MapMoveControl(
          this.mapData,
          rowIndex,
          cellIndex,
          this.root.player.color as PlayerColors,
        );
        return {
          ...cell,
          canMove: moveControl.checks[this.moveStatus](),
        };
      }),
    );
  }
  /** Модалка вопроса */
  isQuestionModalOpen = false;
  /** Capture статус */
  moveStatus: CaptureCheckNames = 'freeCapture';
  /** Может ли игрок захватывать */
  canCapture = false;
  /** Кол-во клеток для захвата */
  captureCount = 0;
  /** Ответы игроков вопроса типа 2 */
  answerOptions: RoomAnswerOptions[] = [];
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
      isQuestionModalOpen: observable,
      canCapture: observable,
      captureCount: observable,
      turnQueue: observable,
      currentTurn: observable,
      whoseTurn: observable,
      mapData: observable,
      moveStatus: observable,
      // computed
      map: computed,
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

  setTurnQueue(data: RoomTurnQueueData) {
    const { type, turns } = data;
    this.type = type;
    this.turnQueue = turns;

    if (this.type === RoomSocketResponseType.attackTurnQueue) {
      this.setMoveStatus('attack');
    }
  }

  setCurrentTurn(data: RoomCurrentTurnData) {
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
  setAnswer(answerData: RoomSocketAnswerData) {
    const { options, answer, type } = answerData;
    this.answer = answer.value;
    if (type === RoomSocketResponseType.answerSecondQuestionType && options) {
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

  setPlayers(playersData: RoomSocketPlayersData) {
    const { players } = playersData;
    this.players = players;
  }

  setType(type: RoomSocketResponseType) {
    this.type = type;
  }

  setMap(mapData: SocketMapData) {
    const { map } = mapData;
    this.mapData = map;
  }

  useQuestionModal = (value: boolean) => {
    this.isQuestionModalOpen = value;
  };

  setMoveStatus = (newStatus: CaptureCheckNames) => {
    this.moveStatus = newStatus;
  };

  setCaptureCapability = (data: RoomSocketAllowedToCaptureData) => {
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

  getCell = (rowIndex: number, cellIndex: number) => {
    this.root.sockets.roomSocket.send({
      type: RoomSocketRequestType.getCell,
      rowIndex,
      cellIndex,
    });
    this.reduceCaptureCount();
  };

  attackCell = (rowIndex: number, cellIndex: number) => {
    this.root.sockets.roomSocket.send({
      type: RoomSocketRequestType.attackCell,
      rowIndex: rowIndex,
      cellIndex: cellIndex,
    });
  };
}
