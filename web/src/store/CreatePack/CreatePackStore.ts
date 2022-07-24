import type { ChangeEvent } from 'react';
import { makeObservable, observable, action, computed, flow } from 'mobx';
import { createPack } from 'api';
import type { CreatePackResponse } from 'api';

import { NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK } from 'const';
import type { Option } from 'components';

import type { RootStore } from '../RootStore';

import { rangeQuestionState } from './RangeQuestionState';
import { multipleChoiceQuestionState } from './MultipleChoiceQuestionState';

export class CreatePackStore {
  /** Root store */
  root: RootStore;
  name = '';
  type: Option | null = null;
  rangeQuestions: rangeQuestionState[] = [];
  multipleChoiceQuestions: multipleChoiceQuestionState[] = [];

  get numericFilledQuestions() {
    return this.rangeQuestions.reduce((acc, item) => {
      acc += item.isFilled ? 1 : 0;
      return acc;
    }, 0);
  }

  get withVariantsFilledQuestions() {
    return this.multipleChoiceQuestions.reduce((acc, item) => {
      acc += item.isFilled ? 1 : 0;
      return acc;
    }, 0);
  }

  /** Заполнены ли все вопросы */
  get isAllFilled() {
    if (!this.rangeQuestions.length || !this.multipleChoiceQuestions.length) {
      return false;
    }

    return (
      this.numericFilledQuestions === this.rangeQuestions.length &&
      this.withVariantsFilledQuestions ===
        this.multipleChoiceQuestions.length &&
      this.type &&
      this.name
    );
  }

  constructor(root: RootStore) {
    makeObservable(this, {
      // computed
      numericFilledQuestions: computed,
      withVariantsFilledQuestions: computed,
      isAllFilled: computed,
      // observable
      name: observable,
      type: observable,
      rangeQuestions: observable,
      multipleChoiceQuestions: observable,
      // action
      setName: action,
      setType: action,
      init: action,
      // flow
      create: flow.bound,
    });
    this.root = root;
  }

  init = () => {
    // TODO: Это говно нужно будет переработать =(
    if (this.rangeQuestions.length || this.multipleChoiceQuestions.length)
      return;

    // TODO: Если смотрмим чужой пак
    this.multipleChoiceQuestions = new Array(
      NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK,
    )
      .fill(0)
      .map(() => new multipleChoiceQuestionState(this.root));

    this.rangeQuestions = Array(NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK)
      .fill(0)
      .map(() => new rangeQuestionState(this.root));
  };

  setName = (e: ChangeEvent<HTMLInputElement>) => {
    this.name = e.target.value;
  };

  setType = (type: Option | null) => {
    this.type = type;
  };

  *create() {
    // TODO: отрефакторить
    const data = (yield createPack({
      categoryId: this.type?.value as number,
      title: this.name,
      pack: {
        multipleChoiceQuestions: this.multipleChoiceQuestions.map(
          (questionState) => {
            const answerIndex = questionState.options.findIndex(
              (answerState) => answerState.isChecked,
            );

            return {
              title: questionState.question,
              options: questionState.options.map(
                (answerState) => answerState.answer,
              ),
              answer: answerIndex,
            };
          },
        ),
        rangeQuestions: this.rangeQuestions.map((questionState) => ({
          title: questionState.question,
          answer: Number(questionState.answer),
        })),
      },
    })) as CreatePackResponse;

    if (!data) {
      return;
    }

    if (data.success) {
      // TODO
    }
  }
}
