import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { Modal, Button, Typography } from 'components';

import { useStore } from 'store';

import classes from './PlayingRoom.module.css';

export const PlayingRoom = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.socketConnection();
  }, [app]);

  const answerHandler = (answer: {}) => {
    return () => {
      if (app.socket) {
        app.socket.send(JSON.stringify(answer));
      }
    };
  };

  return (
    <div className={classes.wrapper}>
      <Modal show={true} className={classes.modal}>
        <Modal.Header>
          
          <Typography.Text className={classes.question} type="text-2" color="white">
            {app.room.title}
          </Typography.Text>
        </Modal.Header>
        <Modal.Body className={classes.body}>
          {app.room.options.map((answer) => {
            return (
              <Button
                key={answer}
                type="regular"
                className={classes.button}
                onClick={answerHandler({ type: 1, option: answer })}
              >
                {answer}
              </Button>
            );
          })}
        </Modal.Body>
      </Modal>
    </div>
  );
});
