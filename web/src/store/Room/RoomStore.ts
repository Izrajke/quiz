import { action, makeObservable, observable } from 'mobx';
import { RootStore } from '../RootStore';
import type {
  AnswerOptions,
  MapData,
  Player,
  PlayerColors,
  SocketAllowedToCaptureData,
  SocketAnswerData,
  SocketMapData,
  SocketOptions,
  SocketPlayersData,
  SocketQuestionData,
} from 'api';
import { SocketRequestType, SocketResponseType } from 'api';

import { withDelay } from 'utils';

import type { CaptureCheckNames } from './classes';
import { MapMoveControl } from './classes';
import { Map } from './types/Map';

/** Тип статуса игры */
export type Status = 'question';

export class RoomStore {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: SocketOptions = {};
  /** Тип сообщения сокета */
  type: SocketResponseType = 999;
  /** Название вопроса */
  title = '';
  /** Статус игры */
  status: Status = 'question';
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
  /** Может ли игрок передвигаться */
  canCapture = false;
  /** Кол-во клеток для захвата */
  captureCount = 0;
  /** Ответы игроков вопроса типа 2 */
  answerOptions: AnswerOptions[] = [];

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
      changeMoveStatus: action,
    });
    this.root = root;
  }

  /** Распарсить данные вопроса, призодящие с сокета */
  setQuestion(questionData: SocketQuestionData) {
    const { question, type } = questionData;
    this.options = question.options || {};
    this.title = question.title;
    this.type = type;
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

  changeMoveStatus = (newStatus: CaptureCheckNames) => {
    this.moveStatus = newStatus;
  };

  setCaptureCapability = (data: SocketAllowedToCaptureData) => {
    const { color, count } = data;
    this.canCapture = color === this.root.player.color;
    if (this.canCapture) {
      this.captureCount = count;
    }
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
    // TODO: убрать запросы вопросов???
    const f = () => {
      if (!this.canCapture && this.moveStatus !== 'attack') {
        this.getQuestion();
      }
    };
    withDelay<boolean>(f.bind(this), 2000, [this.canCapture]);
  };

  // TODO Подумать куда унести (отдельный класс для сокета)
  attackCell = (rowIndex: number, cellIndex: number) => {
    this.root.app.socketMessage({
      type: SocketRequestType.attackCell,
      rowIndex: rowIndex,
      cellIndex: cellIndex,
    });
  };

  // TODO Подумать куда унести (отдельный класс для сокета)
  getQuestion = () => {
    this.root.app.socketMessage({ type: 2 });
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
