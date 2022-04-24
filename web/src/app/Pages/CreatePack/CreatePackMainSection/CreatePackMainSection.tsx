import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { Paper, Input, Typography, RSelect } from 'components';
import type { Option } from 'components';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import classes from './CreatePackMainSection.module.css';

export const CreatePackMainSection: FunctionComponent = observer(() => {
  const { dictionaries, createPack } = useStore();

  const selectOptions = useMemo<Option[]>(
    () =>
      dictionaries.packTypes.map((type) => ({
        label: type.name,
        value: type.uuid,
      })),
    [dictionaries.packTypes],
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
        />
        <RSelect
          options={selectOptions}
          defaultValue={createPack.type}
          label="Тематика"
          wrapperClassName={classes.selectWrapper}
          onChange={createPack.setType}
          isSearchable
          isClearable
          placeholder="выберите тему"
        />
      </div>
    </Paper>
  );
});

CreatePackMainSection.displayName = 'CreatePackMainSection';
