import type { ChangeEvent } from 'react';
import { makeObservable, observable, action } from 'mobx';

import { NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK } from 'const';
import type { Option } from 'components';

import type { RootStore } from '../RootStore';

import { NumericQuestionState } from './NumericQuestionState';
import { WithVariantsQuestionState } from './WithVariantsQuestionState';

export class CreatePackStore {
  /** Root store */
  root: RootStore;
  name = '';
  type: Option | null = null;
  numericQuestions: NumericQuestionState[] = [];
  withVariantsQuestions: WithVariantsQuestionState[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      name: observable,
      type: observable,
      numericQuestions: observable,
      withVariantsQuestions: observable,
      // action
      setName: action,
      setType: action,
      init: action,
    });
    this.root = root;
  }

  init = () => {
    // TODO: Это говно нужно будет переработать =(
    if (this.numericQuestions.length || this.withVariantsQuestions.length)
      return;

    // TODO: Если смотрмим чужой пак
    this.withVariantsQuestions = new Array(NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK)
      .fill(0)
      .map(() => new WithVariantsQuestionState(this.root));

    this.numericQuestions = Array(NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK)
      .fill(0)
      .map(() => new NumericQuestionState(this.root));
  };

  setName = (e: ChangeEvent<HTMLInputElement>) => {
    this.name = e.target.value;
  };

  setType = (type: Option | null) => {
    this.type = type;
  };
}
