import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

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
    <div>
      <h1>{app.room.questionName}</h1>
      {app.room.options.map((answer) => {
        return (
          <button
            key={answer}
            onClick={answerHandler({ type: 1, option: answer })}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
});
