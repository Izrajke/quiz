import { makeObservable, flow, observable } from 'mobx';

import { loadDictionary, DICTIONARIES } from 'api';
import type { DictionaryPackTypes } from 'api';

import type { RootStore } from '../RootStore';

export class DictionariesStore {
  /** Root store */
  root: RootStore;
  /** Словарь типов пака */
  packTypes: DictionaryPackTypes[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      packTypes: observable,
      // flow
      load: flow.bound,
    });
    this.root = root;
  }

  *load() {
    const dictionaries = Object.values(DICTIONARIES);

    const result: unknown[][] = yield Promise.all(
      dictionaries.map((dictionary) => loadDictionary(dictionary)),
    ).catch(() => []);

    for (let i = 0; i < result.length; i++) {
      switch (dictionaries[i]) {
        case DICTIONARIES.filter: {
          this.packTypes = result[i] as DictionaryPackTypes[];
          break;
        }
        default:
          break;
      }
    }
  }
}
