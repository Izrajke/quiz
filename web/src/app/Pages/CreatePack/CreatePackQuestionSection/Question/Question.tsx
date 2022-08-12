import type { FunctionComponent } from 'react';

import type {
  rangeQuestionState,
  multipleChoiceQuestionState,
} from 'store/CreatePack';

import { observer } from 'mobx-react-lite';

import { Numeric } from './Numeric';
import type { NumericComponent } from './Numeric';
import classes from './Question.module.css';
import { WithVariants } from './WithVariants';
import type { WithVariantsComponent } from './WithVariants';



export enum QuestionTypes {
  numeric = 'numeric',
  withVariants = 'withVariants',
}

interface QuestionProps {
  type: QuestionTypes;
  data: multipleChoiceQuestionState | rangeQuestionState;
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
          state={data as rangeQuestionState & multipleChoiceQuestionState}
        />
      </div>
    );
  },
);

Question.displayName = 'Question';
