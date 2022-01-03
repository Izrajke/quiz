import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { PlayingRoomQuestionModal } from './PlayingRoomQuestionModal/PlayingRoomQuestionModal';

import classes from './PlayingRoom.module.css';

export const PlayingRoom = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.socketConnection();
  }, [app]);

  return (
    <div className={classes.wrapper}>
      <PlayingRoomQuestionModal />
    </div>
  );
});
