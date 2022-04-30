import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, Tooltip } from 'components';
import { useStore } from 'store';

import classes from './ControlButtons.module.css';

export const ControlButtons: FunctionComponent = observer(() => {
  const { createPack } = useStore();

  return (
    <div className={classes.wrapper}>
      <Tooltip id="createPackButton" tooltipText="Заполните все вопросы">
        <Button
          className={classes.button}
          type="primary"
          disabled={!createPack.isAllFilled}
        >
          Создать пак
        </Button>
      </Tooltip>
    </div>
  );
});

ControlButtons.displayName = 'ControlButtons';
