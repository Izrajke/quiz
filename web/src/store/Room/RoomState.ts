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
import { MapMoveControl } from './classes';
import type { CaptureCheckNames } from './classes';

import type { Map } from 'components';
import type { SocketMapData } from 'api';

/** Тип статуса игры */
export type TStatus = 'question';

export class RoomState {
  /** Root store */
  root: RootStore;
  /** Статические методы для работы с передвижением по карте */
  mapMoveControl = MapMoveControl;
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
  /** Capture статус */
  moveStatus: CaptureCheckNames = 'attack';

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
    this.root.player.color &&
      (this.map = this.mapFormat(map, this.root.player.color));
  }

  useQuetionModal = (value: boolean) => {
    this.isQuestionModalOpen = value;
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
