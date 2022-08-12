import type { ChangeEvent } from 'react';

import { action, computed, makeObservable, observable } from 'mobx';

import { NormalizedRangeQuestionsData } from 'api';
import { uuid } from 'utils';

import { ViewPackTypes } from '../../app/Pages';
import type { RootStore } from '../RootStore';

export class rangeQuestionState {
  /** Root store */
  root: RootStore;

  uuid: string;
  question = '';
  answer = '';

  get isDisabled() {
    return this.root.createPack.viewType === ViewPackTypes.view;
  }

  get isFilled() {
    return !!(this.question && this.answer);
  }

  constructor(root: RootStore, initFields?: NormalizedRangeQuestionsData) {
    makeObservable(this, {
      // computed
      isFilled: computed,
      isDisabled: computed,
      // observable
      uuid: observable,
      question: observable,
      answer: observable,
      // action
      setQuestion: action,
      setAnswer: action,
    });
    this.root = root;
    this.uuid = uuid();

    if (initFields) {
      this.question = initFields.title;
      this.answer = String(initFields.answer);
    }
  }

  setQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.question = e.target.value;
  };

  setAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    this.answer = e.target.value;
  };
}
