import type { ChangeEvent } from 'react';
import { action, computed, flow, makeObservable, observable } from 'mobx';
import { NavigateFunction } from 'react-router';

import type { NormalizedPackData, SuccessResponse } from 'api';
import { createPack, deletePack, editPack, loadPack } from 'api';

import { NUMBER_OF_ANY_TYPE_QUESTIONS_IN_PACK } from 'const';
import type { Option } from 'components';

import type { RootStore } from '../RootStore';

import { rangeQuestionState } from './RangeQuestionState';
import { multipleChoiceQuestionState } from './MultipleChoiceQuestionState';
import { ViewPackTypes } from '../../app/Pages';
import { toast } from 'react-toastify';

export class CreatePackStore {
  /** Root store */
  root: RootStore;
  name = '';
  type: Option | null = null;
  rangeQuestions: rangeQuestionState[] = [];
  multipleChoiceQuestions: multipleChoiceQuestionState[] = [];
  viewType: ViewPackTypes = ViewPackTypes.create;
  currentPackId: null | string = null;

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
      viewType: observable,
      currentPackId: observable,
      // action
      setName: action,
      setType: action,
      init: action,
      clear: action,
      setCurrentPackId: action,
      // flow
      create: flow.bound,
      loadPack: flow.bound,
      edit: flow.bound,
      delete: flow.bound,
    });
    this.root = root;
  }

  init = (viewType: ViewPackTypes, id?: string) => {
    this.viewType = viewType;

    if (id) {
      this.setCurrentPackId(id);
      this.loadPack(id);
      return;
    }

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

  clear = () => {
    this.rangeQuestions = [];
    this.multipleChoiceQuestions = [];
    this.type = null;
    this.name = '';
    this.currentPackId = null;
  };

  setType = (type: Option | null) => {
    this.type = type;
  };

  setCurrentPackId = (id: string) => {
    this.currentPackId = id;
  };

  *loadPack(id: string) {
    const data = (yield loadPack(id)) as NormalizedPackData;

    if (!data) {
      return;
    }

    const {
      title,
      categoryId,
      pack: { multipleChoiceQuestions, rangeQuestions },
    } = data;

    this.name = title;
    const category = this.root.dictionaries.packTypes.find(
      (type) => type.id === categoryId,
    );

    if (category) {
      this.setType({
        label: category.title,
        value: category.id,
      });
    }

    this.multipleChoiceQuestions = multipleChoiceQuestions.map(
      (question) => new multipleChoiceQuestionState(this.root, question),
    );

    this.rangeQuestions = rangeQuestions.map(
      (question) => new rangeQuestionState(this.root, question),
    );
  }

  *create() {
    const data = (yield createPack(
      this.normalizePackData(),
    )) as SuccessResponse;

    if (!data) {
      return;
    }

    if (data.success) {
      // TODO Возможно стоит перебрасывать на страницу просмотра пака
      this.clear();
      toast.success('пак успешно создан');
    }
  }

  *edit() {
    const data = (yield editPack(
      this.normalizePackData(),
      this.currentPackId || '',
    )) as SuccessResponse;

    if (!data) {
      return;
    }

    // TODO
  }

  *delete(navigate: NavigateFunction) {
    const data = (yield deletePack(
      this.currentPackId || '',
    )) as SuccessResponse;

    if (!data) {
      return;
    }

    this.clear();
    toast.success('Пак успешно удален');
    navigate('/pack/create');
  }

  normalizePackData() {
    return {
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
    };
  }
}
