import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { ModalHeader } from './ModalHeader';
import type { IModalHeaderComponent as ModalHeaderComponent } from './ModalHeader';
import { ModalBody } from './ModalBody';
import type { IModalBodyComponent as ModalBodyComponent } from './ModalBody';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterComponent } from './ModalFooter';

import classes from './Modal.module.css';

interface ModalProps {
  show: boolean;
  closeModal?: () => void;
  className?: string;
}

export interface ModalComponent extends FunctionComponent<ModalProps> {
  Header: ModalHeaderComponent;
  Body: ModalBodyComponent;
  Footer: ModalFooterComponent;
}

/** Компонент модального окна */
export const Modal: ModalComponent = ({
  show,
  closeModal,
  className,
  children,
}) => {
  return show ? (
    <div
      className={clsx(classes.backdrop, !show && classes.notVisible)}
      onClick={closeModal}
    >
      <div
        className={clsx(classes.wrapper, className)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

Modal.displayName = 'Modal';
