import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Numeric } from './Numeric';
import type { NumericComponent } from './Numeric';
import { WithVariants } from './WithVariants';
import type { WithVariantsComponent } from './WithVariants';

import classes from './Question.module.css';

import type {
  NumericQuestionState,
  WithVariantsQuestionState,
} from 'store/CreatePack';

export enum QuestionTypes {
  numeric = 'numeric',
  withVariants = 'withVariants',
}

interface QuestionProps {
  type: QuestionTypes;
  data: WithVariantsQuestionState | NumericQuestionState;
}

const questionComponents = {
  [QuestionTypes.numeric]: Numeric,
  [QuestionTypes.withVariants]: WithVariants,
};

export const Question: FunctionComponent<QuestionProps> = observer(
  ({ type, data }) => {
    const QuestionComponent = questionComponents[type] as
      | NumericComponent
      | WithVariantsComponent;

    return (
      <div className={classes.wrapper}>
        <QuestionComponent
          state={data as NumericQuestionState & WithVariantsQuestionState}
        />
      </div>
    );
  },
);

Question.displayName = 'Question';
