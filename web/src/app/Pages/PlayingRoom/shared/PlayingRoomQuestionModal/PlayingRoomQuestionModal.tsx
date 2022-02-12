import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { SocketResponseType } from 'api';

import { useStore } from 'store';

import { QuestionFirstType } from './QuestionFirstType';
import { QuestionSecondType } from './QuestionSecondType';

export const PlayingRoomQuestionModal: FunctionComponent = observer(() => {
  const { room } = useStore();

  const CurrentModal = useCallback(() => {
    switch (room.type) {
      case SocketResponseType.firstQuestionType:
        return <QuestionFirstType />;
      case SocketResponseType.secondQuestionType:
        return <QuestionSecondType />;
      default:
        return null;
    }
  }, [room.type]);

  return <CurrentModal />;
});

PlayingRoomQuestionModal.displayName = 'PlayingRoomQuestionModal';
