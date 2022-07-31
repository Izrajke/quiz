import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { Paper, Input, Typography, RSelect } from 'components';
import type { Option } from 'components';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import classes from './CreatePackMainSection.module.css';
import { ViewPackTypes } from '../CreatePack';

export const CreatePackMainSection: FunctionComponent = observer(() => {
  const { dictionaries, createPack } = useStore();

  const selectOptions = useMemo<Option[]>(
    () =>
      dictionaries.packTypes.map((type) => ({
        label: type.title,
        value: type.id,
      })),
    [dictionaries.packTypes],
  );

  const isFieldsDisabled = useMemo(
    () => createPack.viewType === ViewPackTypes.view,
    [createPack.viewType],
  );

  return (
    <Paper className={classes.root}>
      <Typography.Text color="white" type="text-1" weight="weight-bold">
        Форма создания пака
      </Typography.Text>
      <div className={classes.inputContainer}>
        <Input
          className={classes.input}
          defaultValue={createPack.name}
          onChange={createPack.setName}
          label="Название пака"
          placeholder="введите название пака"
          disabled={isFieldsDisabled}
        />
        <RSelect
          options={selectOptions}
          value={createPack.type}
          label="Тематика"
          wrapperClassName={classes.selectWrapper}
          onChange={createPack.setType}
          isSearchable
          isClearable
          placeholder="выберите тему"
          disabled={isFieldsDisabled}
        />
      </div>
    </Paper>
  );
});

CreatePackMainSection.displayName = 'CreatePackMainSection';
