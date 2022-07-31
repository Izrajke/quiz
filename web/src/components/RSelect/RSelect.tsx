import { useMemo, useCallback } from 'react';
import type { FunctionComponent } from 'react';

import Select, { ActionMeta } from 'react-select';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import classes from './RSelect.module.css';

type RSelectOnChange = (
  option: Option | null,
  actionMeta: ActionMeta<Option>,
) => void;

export interface Option {
  value: string | number;
  label: string;
}

export interface RSelectProps {
  options: Option[];
  defaultValue?: Option | null;
  value: Option | null;
  onChange: (value: Option | null) => void;
  isClearable?: boolean;
  isSearchable?: boolean;
  wrapperClassName?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const RSelect: FunctionComponent<RSelectProps> = observer(
  ({
    options,
    defaultValue,
    onChange,
    isClearable = false,
    isSearchable = false,
    wrapperClassName,
    label,
    placeholder,
    value,
    disabled,
  }) => {
    const wrapperStyle = useMemo(
      () => clsx(classes.root, wrapperClassName),
      [wrapperClassName],
    );

    const onChangeSelect = useCallback<RSelectOnChange>(
      (option) => {
        onChange(option);
      },
      [onChange],
    );

    return (
      <div className={wrapperStyle}>
        {label}
        <Select
          className={classes.select}
          classNamePrefix="select"
          options={options}
          defaultValue={defaultValue}
          onChange={onChangeSelect}
          isClearable={isClearable}
          isSearchable={isSearchable}
          placeholder={placeholder}
          value={value}
          isDisabled={disabled}
        />
      </div>
    );
  },
);

RSelect.displayName = 'RSelect';
