import { makeObservable, flow, observable, action } from 'mobx';

import { LibraryResponse, loadLibrary } from 'api';
import type { LibraryItem } from 'api';

import type { RootStore } from '../RootStore';

export class LibraryStore {
  /** Root store */
  root: RootStore;

  data: LibraryItem[] = [];
  currentPage = 1;
  totalPages = 1;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      data: observable,
      currentPage: observable,
      totalPages: observable,
      // action
      setCurrentPage: action,
      // flow
      load: flow.bound,
    });
    this.root = root;
  }

  setCurrentPage = (page: number) => {
    this.currentPage = page;
    this.load();
  };

  *load() {
    const data: LibraryResponse | undefined = yield loadLibrary(
      this.currentPage,
    );
    if (!data) return;

    this.data = data.content;
    this.totalPages = data.pagination.totalPages;
  }
}
