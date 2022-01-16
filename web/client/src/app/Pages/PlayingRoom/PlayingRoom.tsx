import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { PlayingRoomMap } from './PlayingRoomMap/PlayingRoomMap';
import { PlayingRoomQuestionModal } from './PlayingRoomQuestionModal/PlayingRoomQuestionModal';
import { PlayingRoomPlayersContainer } from './PlayingRoomPlayersContainer/PlayingRoomPlayersContainer';

// import classes from './PlayingRoom.module.css';

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
