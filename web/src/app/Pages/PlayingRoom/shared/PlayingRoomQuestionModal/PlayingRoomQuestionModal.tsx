import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { RoomSocketResponseType } from 'store/Sockets/RoomSocket/types';

import { observer } from 'mobx-react-lite';


import { useStore } from 'store';

import { QuestionFirstType } from './QuestionFirstType';
import { QuestionSecondType } from './QuestionSecondType';

export const PlayingRoomQuestionModal: FunctionComponent = observer(() => {
  const { room } = useStore();

  const CurrentModal = useCallback(() => {
    switch (room.type) {
      case RoomSocketResponseType.firstQuestionType:
        return <QuestionFirstType />;
      case RoomSocketResponseType.secondQuestionType:
        return <QuestionSecondType />;
      default:
        return null;
    }
  }, [room.type]);

  return <CurrentModal />;
});

PlayingRoomQuestionModal.displayName = 'PlayingRoomQuestionModal';
