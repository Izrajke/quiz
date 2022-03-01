import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import { Modal } from 'components';

// import { Question } from './Question';
import { Result } from './Result';

export const QuestionSecondType: FunctionComponent = observer(() => {
  const { room } = useStore();

  return (
    <Modal show={room.isQuestionModalOpen}>
      {/* <Question /> */}
      {/* TODO: дописать */}
      <Result />
    </Modal>
  );
});

QuestionSecondType.displayName = 'QuestionSecondType';
