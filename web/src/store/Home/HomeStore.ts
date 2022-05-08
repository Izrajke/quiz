import { makeObservable } from 'mobx';

import type { RootStore } from '../RootStore';

export class HomeStore {
  /** Root store */
  root: RootStore;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      // action
    });
    this.root = root;
  }
}
