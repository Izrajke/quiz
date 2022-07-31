import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { ViewPackTypes } from '../../CreatePack';

import { Input, Textarea } from 'components';
import type { rangeQuestionState } from 'store/CreatePack/RangeQuestionState';

import classes from './Question.module.css';

export interface NumericProps {
  state: rangeQuestionState;
}

export type NumericComponent = FunctionComponent<NumericProps>;

export const Numeric: NumericComponent = observer(({ state }) => {
  const { createPack } = useStore();

  const isFieldsDisabled = useMemo(
    () => createPack.viewType === ViewPackTypes.view,
    [createPack.viewType],
  );

  return (
    <div className={classes.numericWrapper}>
      <Textarea
        onChange={state.setQuestion}
        defaultValue={state.question}
        className={classes.textarea}
        label="Вопрос"
        placeholder="введите вопрос"
        rows={6}
        disabled={isFieldsDisabled}
      />
      <Input
        label="Ответ, число"
        defaultValue={state.answer}
        onChange={state.setAnswer}
        disabled={isFieldsDisabled}
      />
    </div>
  );
});

Numeric.displayName = 'Numeric';
