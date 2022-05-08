import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Textarea } from 'components';
import { useStore } from 'store';

import classes from './HomeChatSection.module.css';

export const HomeChatSection: FunctionComponent = observer(() => {
  const { sockets } = useStore();

  const onSendMessage = useCallback(() => {
    sockets.homeSocket?.send({
      type: 10,
      message: '123',
      // TODO убрать any
    } as any);
  }, [sockets.homeSocket]);

  return (
    <Paper className={classes.chat}>
      <div className={classes.messagesContainer}></div>
      <Textarea
        className={classes.textarea}
        placeholder="Введите сообщение ..."
      />
      {/*TODO: убрать*/}
      <button onClick={onSendMessage}>отправить</button>
    </Paper>
  );
});

HomeChatSection.displayName = 'HomeChatSection';
