import type { FunctionComponent, ReactNode } from 'react';

import { observer } from 'mobx-react-lite';

import { Modal, Button } from 'components';
import type { ButtonProps } from 'components';

import { useStore } from 'store';

export type ClickTypes = 'submit' | 'cancel';

export interface DialogButtonProps extends ButtonProps {
  /** Тип нажатия */
  clickType?: ClickTypes;
}

export interface DialogProps {
  header: ReactNode;
  body: ReactNode;
  dialogButtons?: DialogButtonProps[];
}

export const Dialog: FunctionComponent = observer(() => {
  const { app } = useStore();

  if (!app.dialogs.length) return null;

  const { header, body, dialogButtons } = app.dialogs[0];

  /** Устанавливает поведение кнопки в зависимости от её роли */
  const getButtonClickHandler =
    (onClick?: () => void, clickType?: ClickTypes) => () => {
      switch (clickType) {
        case 'submit':
          onClick && onClick();
          app.removeDialog();
          break;
        case 'cancel':
          app.removeDialog();
          break;
        default:
          onClick && onClick();
          break;
      }
    };

  return (
    <Modal show closeModal={app.removeDialog}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {dialogButtons && (
        <Modal.Footer>
          {dialogButtons.map((buttonProps) => (
            <Button
              {...buttonProps}
              onClick={getButtonClickHandler(
                buttonProps.onClick,
                buttonProps.clickType,
              )}
              key={Math.random()}
            />
          ))}
        </Modal.Footer>
      )}
    </Modal>
  );
});

Dialog.displayName = 'Dialog';
