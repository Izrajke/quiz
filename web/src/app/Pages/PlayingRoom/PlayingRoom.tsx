import { useEffect } from 'react';
import { useParams } from 'react-router';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import {
  PlayingRoomMap,
  PlayingRoomQuestionModal,
  PlayingRoomPlayersContainer,
} from './shared';

export const PlayingRoom = observer(() => {
  const { app } = useStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      app.socketConnection(id);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <PlayingRoomMap />
      <PlayingRoomQuestionModal />
      <PlayingRoomPlayersContainer />
    </>
  );
});
