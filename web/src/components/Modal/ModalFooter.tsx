import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import classes from './Modal.module.css';

interface ModalFooterProps {
  className?: string;
}

export type ModalFooterComponent = FunctionComponent<ModalFooterProps>;

export const ModalFooter: ModalFooterComponent = observer(
  ({ children, className }) => {
    return <div className={clsx(classes.footer, className)}>{children}</div>;
  },
);

ModalFooter.displayName = 'ModalFooter';
