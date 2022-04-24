import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Input, Textarea, Checkbox } from 'components';
import type { WithVariantsQuestionState } from 'store/CreatePack/WithVariantsQuestionState';

import classes from './Question.module.css';

export interface WithVariantsProps {
  state: WithVariantsQuestionState;
}

export type WithVariantsComponent = FunctionComponent<WithVariantsProps>;

export const WithVariants: WithVariantsComponent = observer(({ state }) => {
  return (
    <div className={classes.withVariantsWrapper}>
      <Textarea
        onChange={state.setQuestion}
        defaultValue={state.question}
        className={classes.textarea}
        label="Вопрос"
        placeholder="введите вопрос"
        rows={6}
      />
      <div className={classes.variantsContainer}>
        {state.options.map((option, index) => (
          <div key={option.uuid} className={classes.variant}>
            <Input
              className={classes.variantInput}
              defaultValue={option.answer}
              onChange={option.setAnswer}
              label={index === 0 ? 'Варианты ответа' : undefined}
            />
            <Checkbox
              checked={option.isChecked}
              onChange={option.onCheck}
              className={classes.checkbox}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

WithVariants.displayName = 'WithVariants';
