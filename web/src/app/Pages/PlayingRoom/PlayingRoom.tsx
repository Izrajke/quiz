import { useEffect } from 'react';

import { useParams } from 'react-router';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import {
  PlayingRoomMap,
  PlayingRoomQuestionModal,
  PlayingRoomPlayersContainer,
  PlayingRoomTurnQueue,
} from './shared';

export const PlayingRoom = observer(() => {
  const { sockets } = useStore();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      sockets.roomSocket.connect(id);
    }

    return () => {
      sockets.roomSocket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <PlayingRoomTurnQueue />
      <PlayingRoomMap />
      <PlayingRoomQuestionModal />
      <PlayingRoomPlayersContainer />
    </>
  );
});
