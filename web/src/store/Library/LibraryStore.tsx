import { makeObservable, flow, observable } from 'mobx';

import { loadLibrary } from 'api';
import type { LibraryItem } from 'api';

import type { RootStore } from '../RootStore';

export class LibraryStore {
  /** Root store */
  root: RootStore;

  data: LibraryItem[] = [];

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      data: observable,
      // action
      // flow
      load: flow.bound,
    });
    this.root = root;
  }

  *load() {
    const data: LibraryItem[] | undefined = yield loadLibrary();

    if (!data) return;

    this.data = data;
  }
}
