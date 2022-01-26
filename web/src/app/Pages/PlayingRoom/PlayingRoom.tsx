import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import {
  PlayingRoomMap,
  PlayingRoomQuestionModal,
  PlayingRoomPlayersContainer,
} from './shared';

export const PlayingRoom = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.socketConnection();
  }, [app]);

  return (
    <>
      <PlayingRoomMap />
      <PlayingRoomQuestionModal />
      <PlayingRoomPlayersContainer />
    </>
  );
});
