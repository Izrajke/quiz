import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { ModalHeader } from './ModalHeader';
import type { IModalHeaderComponent } from './ModalHeader';
import { ModalBody } from './ModalBody';
import type { IModalBodyComponent } from './ModalBody';

import classes from './Modal.module.css';

interface IModal {
  show: boolean;
  closeModal?: () => void;
  className?: string;
}

export interface IModalComponent extends FunctionComponent<IModal> {
  Header: IModalHeaderComponent;
  Body: IModalBodyComponent;
}

/** Компонент модального окна */
export const Modal: IModalComponent = ({
  show,
  closeModal,
  className,
  children,
}) => {
  return (
    <>
      {show ? (
        <div className={classes.backdrop} onClick={closeModal}>
          <div className={clsx(classes.wrapper, className)}>{children}</div>
        </div>
      ) : null}
    </>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;

Modal.displayName = 'Modal';
