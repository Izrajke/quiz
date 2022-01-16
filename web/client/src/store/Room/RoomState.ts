import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '../RootStore';
import type {
  TSocketResponseType,
  ISocketOptions,
  ISocketQuestionData,
  ISocketAnswerData,
  ISocketPlayesData,
  IPlayer,
} from 'api';

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
  /** Ответ на вопрос */
  answer = '';
  /** Игроки */
  players: IPlayer[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      options: observable,
      type: observable,
      title: observable,
      answer: observable,
      players: observable,
      // action
      setQuestion: action,
      setAnswer: action,
      setPlayers: action,
      resetAnswer: action,
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

  setPlayers(playersData: ISocketPlayesData) {
    const { players } = playersData;
    this.players = players;
  }

  setType(type: TSocketResponseType) {
    this.type = type;
  }
}
