import type { FunctionComponent } from 'react';
import { useMemo, useCallback } from 'react';

import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';

import { Button, Tooltip } from 'components';
import { useStore } from 'store';
import { ViewPackTypes } from '../../CreatePack';

import classes from './ControlButtons.module.css';

export const ControlButtons: FunctionComponent = observer(() => {
  const { createPack } = useStore();
  const navigate = useNavigate();

  const isCreatePackButtonVisible = useMemo(
    () => createPack.viewType === ViewPackTypes.create,
    [createPack.viewType],
  );

  const onPackDelete = useCallback(() => {
    createPack.delete(navigate);
  }, [createPack, navigate]);

  return (
    <div className={classes.wrapper}>
      {isCreatePackButtonVisible && (
        <Tooltip id="createPackButton" tooltipText="Заполните все вопросы">
          <Button
            className={classes.button}
            type="primary"
            disabled={!createPack.isAllFilled}
            onClick={createPack.create}
          >
            Создать пак
          </Button>
        </Tooltip>
      )}
      {!isCreatePackButtonVisible && (
        <>
          <Button
            className={classes.button}
            type="danger"
            onClick={onPackDelete}
          >
            Удалить
          </Button>
          <Button
            className={classes.button}
            type="primary"
            onClick={createPack.edit}
          >
            Редактировать
          </Button>
        </>
      )}
    </div>
  );
});

ControlButtons.displayName = 'ControlButtons';
