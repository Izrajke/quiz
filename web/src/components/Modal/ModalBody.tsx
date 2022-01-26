import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Modal.module.css';

interface IModalBody {
  className?: string;
}

export type IModalBodyComponent = FunctionComponent<IModalBody>

export const ModalBody: IModalBodyComponent = observer(
  ({ children, className }) => {
    return <div className={clsx(classes.body, className)}>{children}</div>;
  },
);

ModalBody.displayName = 'ModalBody';
