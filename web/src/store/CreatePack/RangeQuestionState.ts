import type { ChangeEvent } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';

import { uuid } from 'utils';

import type { RootStore } from '../RootStore';

export class rangeQuestionState {
  /** Root store */
  root: RootStore;

  uuid: string;
  question = '';
  answer = '';

  get isFilled() {
    return !!(this.question && this.answer);
  }

  constructor(root: RootStore, id?: string) {
    makeObservable(this, {
      // computed
      isFilled: computed,
      // observable
      uuid: observable,
      question: observable,
      answer: observable,
      // action
      setQuestion: action,
      setAnswer: action,
    });
    this.root = root;
    this.uuid = id || uuid();
  }

  setQuestion = (e: ChangeEvent<HTMLTextAreaElement>) => {
    this.question = e.target.value;
  };

  setAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    this.answer = e.target.value;
  };
}
