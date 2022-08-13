import { FunctionComponent, useEffect, useRef } from 'react';

import classes from './HomeChatSection.module.css';

export const MessagesContainer: FunctionComponent = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [children]);

  return (
    <div className={classes.messagesContainer} ref={ref}>
      {children}
    </div>
  );
};

MessagesContainer.displayName = 'MessagesContainer';
