import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Header, CreateRoomModal } from 'components';
import { useStore } from 'store';

import { HomeChatSection } from './HomeChatSection';
import { HomeLobbiesSection } from './HomeLobbiesSection';

import classes from './Home.module.css';

export const Home: FunctionComponent = observer(() => {
  const { sockets } = useStore();

  useEffect(() => {
    sockets.homeSocket.connect();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.wrapper}>
      <CreateRoomModal />
      <Header />
      <div className={classes.body}>
        <HomeChatSection />
        <HomeLobbiesSection />
      </div>
    </div>
  );
});
