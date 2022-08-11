import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Modal } from 'components';
import { useStore } from 'store';

import { Question } from './Question';
import { Result } from './Result';
import { Waiting } from './Waiting';

export const QuestionSecondType: FunctionComponent = observer(() => {
  const { room } = useStore();

  return (
    <Modal show={room.isQuestionModalOpen}>
      {!room.playerAnswer && <Question />}
      {room.playerAnswer && !room.answer && <Waiting />}
      {room.answer && <Result />}
    </Modal>
  );
});

QuestionSecondType.displayName = 'QuestionSecondType';
