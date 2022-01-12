import { useState } from 'react';
import type { FunctionComponent, ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import classes from './SocketLogger.module.css';

export const SocketLogger: FunctionComponent = observer(() => {
  const [message, setMessage] = useState('');
  const { app } = useStore();

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const messageHandler = () => {
    app.socketMessage(message);
  };

  const getQuestionHandler = () => {
    app.socketMessage({ type: 2 });
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.loggerContent}>
        {app.socketLog.map(([sendingType, message], index) => {
          return (
            <div className={classes.message} key={index}>
              <b className={classes[sendingType]}>{sendingType}:</b>{' '}
              <span>{JSON.stringify(message)}</span>
            </div>
          );
        })}
      </div>
      <input
        className={classes.input}
        onChange={inputHandler}
        type="text"
        placeholder="событие"
      />
      <button onClick={messageHandler} className={classes.button}>
        Отправить событие
      </button>
      <button onClick={getQuestionHandler} className={classes.button}>
        Получить вопрос
      </button>
    </div>
  );
});

SocketLogger.displayName = 'SocketLogger';
