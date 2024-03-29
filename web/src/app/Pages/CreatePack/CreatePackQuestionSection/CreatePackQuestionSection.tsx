import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Typography } from 'components';
import { useStore } from 'store';

import { ControlButtons } from './ControlButtons';
import classes from './CreatePackQuestionSection.module.css';
import { Question, QuestionTypes } from './Question';
import { QuestionCounter } from './QuestionCounter';

export const CreatePackQuestionSection: FunctionComponent = observer(() => {
  const { createPack } = useStore();

  return (
    <Paper className={classes.root}>
      <Typography.Text color="white" type="text-1" weight="weight-bold">
        Вопросы
      </Typography.Text>
      {/* TODO: FAQ block*/}
      <div className={classes.questionsWrapper}>
        <div className={classes.questionsContainer}>
          <QuestionCounter
            type={QuestionTypes.numeric}
            count={createPack.rangeQuestions.length}
            countFilled={createPack.numericFilledQuestions}
          />
          {createPack.rangeQuestions.map((question) => (
            <Question
              key={question.uuid}
              type={QuestionTypes.numeric}
              data={question}
            />
          ))}
        </div>
        <div className={classes.divider} />
        <div className={classes.questionsContainer}>
          <QuestionCounter
            type={QuestionTypes.withVariants}
            count={createPack.rangeQuestions.length}
            countFilled={createPack.withVariantsFilledQuestions}
            textAlign="right"
          />
          {createPack.multipleChoiceQuestions.map((question) => (
            <Question
              key={question.uuid}
              type={QuestionTypes.withVariants}
              data={question}
            />
          ))}
        </div>
      </div>
      <ControlButtons />
    </Paper>
  );
});

CreatePackQuestionSection.displayName = 'CreatePackQuestionSection';
