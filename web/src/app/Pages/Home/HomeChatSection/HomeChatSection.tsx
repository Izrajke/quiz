import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Textarea } from 'components';
import { useStore } from 'store';

import { Message } from './Message';

import classes from './HomeChatSection.module.css';

export const HomeChatSection: FunctionComponent = observer(() => {
  const { sockets, home } = useStore();

  const onSendMessage = useCallback(() => {
    sockets.homeSocket?.send({
      type: 10,
      message: '1234444',
      // TODO убрать any
    } as any);
  }, [sockets.homeSocket]);

  return (
    <Paper className={classes.chat}>
      <div className={classes.messagesContainer}>
        {home.messages.map((data) => (
          <Message key={data.uuid} {...data} />
        ))}
      </div>
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
