import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import classes from './Modal.module.css';

interface IModalHeader {
  className?: string;
}

export type IModalHeaderComponent = FunctionComponent<IModalHeader>

export const ModalHeader: IModalHeaderComponent = observer(({ children }) => {
  return <div className={classes.header}>{children}</div>;
});

ModalHeader.displayName = 'ModalHeader';
