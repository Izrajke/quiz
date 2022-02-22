import { useState } from 'react';
import type { FunctionComponent, ChangeEvent } from 'react';

import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import classes from './SocketLogger.module.css';

export const SocketLogger: FunctionComponent = observer(() => {
  // eslint-disable-next-line
  const [message, setMessage] = useState<any>('');
  const [isOpen, setIsOpen] = useState(false);
  const { app } = useStore();

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const messageHandler = () => {
    app.socketMessage(message);
  };

  const closeHandler = () => {
    setIsOpen(!isOpen);
  };

  if (!app.socket) return null;

  return (
    <div className={classes.wrapper}>
      <button onClick={closeHandler}>
        {isOpen ? '↑скрыть↑' : '↓открыть↓'}
      </button>
      {isOpen ? (
        <>
          <div className={classes.loggerContent}>
            {app.socket.log.map(([sendingType, message], index) => {
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
        </>
      ) : null}
    </div>
  );
});

SocketLogger.displayName = 'SocketLogger';
