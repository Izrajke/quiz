import { useCallback } from 'react';
import type { FunctionComponent, KeyboardEvent } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { observer } from 'mobx-react-lite';

import { Paper, Textarea } from 'components';
import { useStore } from 'store';

import classes from './HomeChatSection.module.css';
import './animation.css';
import { Message } from './Message';
import { MessagesContainer } from './MessagesContainer';

export const HomeChatSection: FunctionComponent = observer(() => {
  const { home, player } = useStore();

  const onSendMessage = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && home.newMessageValue) {
        home.sendMessage();
      }
    },
    // eslint-disable-next-line
    [home.newMessageValue],
  );

  // TODO: сравнение должно быть с ID игрока
  const calculateTransitionClassNames = useCallback(
    (author: string) => {
      return author === player.nickname ? 'author' : 'other';
    },
    [player.nickname],
  );

  return (
    <Paper className={classes.chat}>
      <TransitionGroup component={MessagesContainer}>
        {home.messages.map((data) => (
          <CSSTransition
            key={data.time + data.message}
            classNames={calculateTransitionClassNames(data.author)}
            timeout={140}
          >
            <Message {...data} />
          </CSSTransition>
        ))}
      </TransitionGroup>
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
