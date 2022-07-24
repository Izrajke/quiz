import type { ChangeEvent } from 'react';
import { action, makeObservable, observable, computed } from 'mobx';

import { uuid } from 'utils';
import { NUMBER_OF_VARIANTS } from 'const';

import type { RootStore } from '../RootStore';

class QuestionAnswerState {
  questionState: multipleChoiceQuestionState;
  answer = '';
  uuid: string;

  get isChecked() {
    return this.questionState.correctAnswer === this.uuid;
  }

  constructor(questionState: multipleChoiceQuestionState, id?: string) {
    makeObservable(this, {
      // observable
      answer: observable,
      // computed
      isChecked: computed,
      // action
      setAnswer: action,
      onCheck: action,
    });
    this.questionState = questionState;
    this.uuid = id || uuid();
  }

  setAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    this.answer = e.target.value;
  };

  onCheck = () => {
    this.questionState.setCorrectAnswer(this.uuid);
  };
}

export class multipleChoiceQuestionState {
  /** Root store */
  root: RootStore;

  uuid: string;
  question = '';
  options: QuestionAnswerState[] = [];
  correctAnswer: string | null = null;

  get isFilled() {
    return !!(
      this.question &&
      this.correctAnswer &&
      !this.options.filter((option) => option.answer === '').length
    );
  }

  constructor(root: RootStore, id?: string) {
    makeObservable(this, {
      // computed
      isFilled: computed,
      // observable
      question: observable,
      options: observable,
      correctAnswer: observable,
      // action
      setQuestion: action,
      setCorrectAnswer: action,
    });
    this.root = root;
    this.options = new Array(NUMBER_OF_VARIANTS)
      .fill(0)
      .map(() => new QuestionAnswerState(this));
    this.uuid = id || uuid();
  }

  setQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.question = e.target.value;
  };

  setCorrectAnswer = (uuid: string) => {
    if (this.correctAnswer === uuid) {
      this.correctAnswer = null;
    } else {
      this.correctAnswer = uuid;
    }
  };
}
