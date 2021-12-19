import { makeObservable, observable, action } from 'mobx';
import { RootStore } from '../RootStore';

/** Типы вопросов */
enum questionType {
  /** Обычный вопрос с 4-мя вариантами ответа */
  firstType = 1,
  /** Вопрос без вариантов ответа */
  secondType = 2,
}

/** Интерфейс вопросов призодящих с бекенда */
interface IQuestionData {
  options: string[];
  question: string;
  type: questionType;
}

export class RoomState {
  /** Root store */
  root: RootStore;
  /** Варианты ответа  */
  options: string[] = [];
  /** Тип вопроса */
  type: questionType = 1;
  /** Название вопроса */
  questionName: string = '';

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      options: observable,
      type: observable,
      questionName: observable,
      // action
      setQuestion: action,
    });
    this.root = root;
  }

  /** Распарсить данные вопроса, призодящие с сокета */
  setQuestion(questionData: IQuestionData) {
    const { options, question, type } = questionData;
    this.options = options;
    this.questionName = question;
    this.type = type;
  }
}
