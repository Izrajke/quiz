import { useCallback } from 'react';
import type { FunctionComponent, KeyboardEvent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Textarea } from 'components';
import { useStore } from 'store';

import { Message } from './Message';

import classes from './HomeChatSection.module.css';

export const HomeChatSection: FunctionComponent = observer(() => {
  const { home } = useStore();

  const onSendMessage = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && home.newMessageValue) {
        home.sendMessage();
      }
    },
    // eslint-disable-next-line
    [home.newMessageValue],
  );

  return (
    <Paper className={classes.chat}>
      <div className={classes.messagesContainer}>
        {home.messages.map((data) => (
          <Message key={data.uuid} {...data} />
        ))}
      </div>
      <Textarea
        className={classes.textarea}
        value={home.newMessageValue}
        onChange={home.setNewMessageValue}
        onKeyDown={onSendMessage}
        placeholder="Введите сообщение ..."
      />
    </Paper>
  );
});

HomeChatSection.displayName = 'HomeChatSection';
