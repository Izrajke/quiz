import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '../RootStore';
import type {
  SocketResponseType,
  SocketOptions,
  SocketQuestionData,
  SocketAnswerData,
  SocketPlayersData,
  SoсketAllowedToCaptureData,
  Player,
  MapData,
  PlayerColors,
} from 'api';
import { SocketRequestType } from 'api';

import { withDelay } from 'utils';

import { MapMoveControl } from './classes';
import type { CaptureCheckNames } from './classes';
import { Map } from './types/Map';

import type { SocketMapData } from 'api';

/** Тип статуса игры */
export type Status = 'question';

export class RoomStore {
  /** Root store */
  root: RootStore;
  /** Статические методы для работы с передвижением по карте */
  mapMoveControl = MapMoveControl;
  /** Варианты ответа  */
  options: SocketOptions = {};
  /** Тип вопроса */
  type: SocketResponseType = 999;
  /** Название вопроса */
  title = '';
  /** Статус игры */
  status: Status = 'question';
  /** Ответ игрока */
  playerAnswer = '';
  /** Ответ на вопрос с сервера */
  answer = '';
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
      useQuetionModal: action,
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
    this.options = question.options;
    this.title = question.title;
    this.type = type;
  }

  /** Правильный ответ на вопрос */
  setAnswer(answerData: SocketAnswerData) {
    const { answer } = answerData;
    this.answer = answer.value;
  }

  /** Сбросить правильный ответ */
  resetAnswer() {
    this.answer = '';
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

  useQuetionModal = (value: boolean) => {
    this.isQuestionModalOpen = value;
  };

  changeMoveStatus = (newStatus: CaptureCheckNames) => {
    this.moveStatus = newStatus;
  };

  setCaptureCapability = (data: SoсketAllowedToCaptureData) => {
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
      row.map((cell, cellIndex) => ({
        ...cell,
        canMove: this.mapMoveControl.checks[this.moveStatus](
          mapData,
          rowIndex,
          cellIndex,
          player,
        ),
      })),
    );
}
