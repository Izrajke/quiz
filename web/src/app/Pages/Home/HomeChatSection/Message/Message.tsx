import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import clsx from 'clsx';

import { observer } from 'mobx-react-lite';

import { Typography } from 'components';
import { useStore } from 'store';
import type { HomeSocketMessage } from 'store/Sockets/HomeSocket';

import classes from './Message.module.css';

export const Message: FunctionComponent<HomeSocketMessage> = observer(
  ({ message, author, time }) => {
    const { player } = useStore();

    const isPlayerAuthor = useMemo(
      () => player.nickname === author,
      [player.nickname, author],
    );

    const styles = useMemo(
      () => ({
        wrapper: clsx(
          classes.wrapper,
          isPlayerAuthor && classes.wrapperPlayerIsAuthor,
        ),
        message: clsx(
          classes.message,
          isPlayerAuthor && classes.messagePlayerIsAuthor,
        ),
        info: clsx(isPlayerAuthor ? classes.infoPlayerIsAuthor : classes.info),
      }),
      [isPlayerAuthor],
    );

    return (
      <div className={styles.wrapper}>
        {!isPlayerAuthor && <div className={classes.triangleLeft} />}
        <div className={styles.message}>
          <Typography.Text color="white" type="caption-1">
            {message}
          </Typography.Text>
          <div className={styles.info}>
            <Typography.Text color="white-50" type="caption-2">
              {`${isPlayerAuthor ? 'Вы' : author} ${time}`}
            </Typography.Text>
          </div>
        </div>
        {isPlayerAuthor && <div className={classes.triangleRight} />}
      </div>
    );
  },
);

Message.displayName = 'Message';
