import type { ChangeEvent } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';

import { uuid } from 'utils';
import { NUMBER_OF_VARIANTS } from 'const';
import type { NormalizedMultipleChoiceQuestionsData } from 'api';

import type { RootStore } from '../RootStore';
import { ViewPackTypes } from '../../app/Pages';

class QuestionAnswerState {
  questionState: multipleChoiceQuestionState;
  answer = '';
  uuid: string;

  get isDisabled() {
    return this.questionState.isDisabled;
  }

  get isChecked() {
    return this.questionState.correctAnswer === this.uuid;
  }

  constructor(
    questionState: multipleChoiceQuestionState,
    value?: string,
    id?: string,
  ) {
    makeObservable(this, {
      // observable
      answer: observable,
      // computed
      isChecked: computed,
      isDisabled: computed,
      // action
      setAnswer: action,
      onCheck: action,
    });
    this.questionState = questionState;
    this.uuid = id || uuid();

    if (value) {
      this.answer = value;
    }
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

  get isDisabled() {
    return this.root.createPack.viewType === ViewPackTypes.view;
  }

  get isFilled() {
    return !!(
      this.question &&
      this.correctAnswer &&
      !this.options.filter((option) => option.answer === '').length
    );
  }

  constructor(
    root: RootStore,
    initFields?: NormalizedMultipleChoiceQuestionsData,
  ) {
    makeObservable(this, {
      // computed
      isFilled: computed,
      isDisabled: computed,
      // observable
      question: observable,
      options: observable,
      correctAnswer: observable,
      // action
      setQuestion: action,
      setCorrectAnswer: action,
    });
    this.root = root;
    this.uuid = uuid();

    if (initFields) {
      this.question = initFields.title;

      this.options = initFields.options.map((option, i) => {
        const id = uuid();

        if (i === initFields.answer) {
          this.correctAnswer = id;
        }

        return new QuestionAnswerState(this, option, id);
      });

      return;
    }

    this.options = new Array(NUMBER_OF_VARIANTS)
      .fill(0)
      .map(() => new QuestionAnswerState(this));
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
