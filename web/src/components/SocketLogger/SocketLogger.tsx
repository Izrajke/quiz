import { useState } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import classes from './SocketLogger.module.css';

export const SocketLogger: FunctionComponent = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { sockets } = useStore();

  const closeHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={classes.wrapper}>
      <button onClick={closeHandler}>
        {isOpen ? '↑скрыть↑' : '↓открыть↓'}
      </button>
      {isOpen ? (
        <>
          <div className={classes.loggerContent}>
            {sockets.log.map(([sendingType, message], index) => {
              return (
                <div className={classes.message} key={index}>
                  <b className={classes[sendingType]}>{sendingType}:</b>{' '}
                  <span>{JSON.stringify(message)}</span>
                </div>
              );
            })}
          </div>
          <input className={classes.input} type="text" placeholder="событие" />
        </>
      ) : null}
    </div>
  );
});

SocketLogger.displayName = 'SocketLogger';
