import type { ChangeEvent } from 'react';
import { makeObservable, observable, action } from 'mobx';

import type { Option } from 'components';

import type { RootStore } from '../RootStore';

export class CreatePackStore {
  /** Root store */
  root: RootStore;
  name = '';
  type: Option | null = null;

  constructor(root: RootStore) {
    makeObservable(this, {
      // observable
      name: observable,
      type: observable,
      // action
      setName: action,
      setType: action,
    });
    this.root = root;
  }

  setName = (e: ChangeEvent<HTMLInputElement>) => {
    this.name = e.target.value;
  };

  setType = (type: Option | null) => {
    this.type = type;
  };
}
