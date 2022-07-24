import type { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { Textarea, Input } from 'components';
import type { rangeQuestionState } from 'store/CreatePack/RangeQuestionState';

import classes from './Question.module.css';

export interface NumericProps {
  state: rangeQuestionState;
}

export type NumericComponent = FunctionComponent<NumericProps>;

export const Numeric: NumericComponent = observer(({ state }) => {
  return (
    <div className={classes.numericWrapper}>
      <Textarea
        onChange={state.setQuestion}
        defaultValue={state.question}
        className={classes.textarea}
        label="Вопрос"
        placeholder="введите вопрос"
        rows={6}
      />
      <Input
        label="Ответ, число"
        defaultValue={state.answer}
        onChange={state.setAnswer}
      />
    </div>
  );
});

Numeric.displayName = 'Numeric';
