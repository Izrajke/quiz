import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import type { multipleChoiceQuestionState } from 'store/CreatePack/MultipleChoiceQuestionState';

import { observer } from 'mobx-react-lite';

import { Input, Textarea, Checkbox } from 'components';
import { useStore } from 'store';

import { ViewPackTypes } from '../../CreatePack';

import classes from './Question.module.css';


export interface WithVariantsProps {
  state: multipleChoiceQuestionState;
}

export type WithVariantsComponent = FunctionComponent<WithVariantsProps>;

export const WithVariants: WithVariantsComponent = observer(({ state }) => {
  const { createPack } = useStore();

  const isFieldsDisabled = useMemo(
    () => createPack.viewType === ViewPackTypes.view,
    [createPack.viewType],
  );

  return (
    <div className={classes.withVariantsWrapper}>
      <Textarea
        onChange={state.setQuestion}
        defaultValue={state.question}
        className={classes.textarea}
        label="Вопрос"
        placeholder="введите вопрос"
        rows={6}
        disabled={isFieldsDisabled}
      />
      <div className={classes.variantsContainer}>
        {state.options.map((option, index) => (
          <div key={option.uuid} className={classes.variant}>
            <Input
              className={classes.variantInput}
              defaultValue={option.answer}
              onChange={option.setAnswer}
              label={index === 0 ? 'Варианты ответа' : undefined}
              disabled={isFieldsDisabled}
            />
            <Checkbox
              checked={option.isChecked}
              onChange={option.onCheck}
              className={classes.checkbox}
              disabled={isFieldsDisabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

WithVariants.displayName = 'WithVariants';
