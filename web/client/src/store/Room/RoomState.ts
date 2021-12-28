import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '../RootStore';

/** Типы вопросов */
enum TQuestionType {
  /** Обычный вопрос с 4-мя вариантами ответа */
  firstQuestionType = 1,
  /** Вопрос без вариантов ответа */
  secondQuestionType = 2,
  /** Ответ на вопрос первого типа */
  answerFirstQuestionType = 5,
  /** Ответ на вопрос второго типа */
  answerSecondQuestionType = 6,
  /** Конец игры */
  endGame = 999,
}

interface IQuestion {
  title: string;
  options: string[];
}

/** Интерфейс вопросов призодящих с бекенда */
export interface IQuestionData {
  question: IQuestion;
  type: TQuestionType;
}

/** Тип статуса игры */
export type TStatus = 'question';

export class RoomState {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: string[] = [];
  /** Тип вопроса */
  type: TQuestionType = 1;
  /** Название вопроса */
  title: string = '';
  /** Статус игры */
  status: TStatus = 'question';

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      options: observable,
      type: observable,
      title: observable,
      // action
      setQuestion: action,
    });
    this.root = root;
  }

  /** Распарсить данные вопроса, призодящие с сокета */
  setQuestion(questionData: IQuestionData) {
    const { question, type } = questionData;
    this.options = Object.values(question.options);
    this.title = question.title;
    this.type = type;
  }
}
