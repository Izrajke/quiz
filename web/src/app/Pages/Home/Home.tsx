import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { CreateRoomModal } from 'components';
import { useStore } from 'store';

import { HomeChatSection } from './HomeChatSection';
import { HomeLobbiesSection } from './HomeLobbiesSection';

import classes from './Home.module.css';

export const Home: FunctionComponent = observer(() => {
  const {
    sockets: { homeSocket },
  } = useStore();

  useEffect(() => {
    homeSocket.connect();
    // eslint-disable-next-line
    return () => {
      homeSocket.disconnect();
    };
  }, [homeSocket]);

  return (
    <>
      <CreateRoomModal />
      <div className={classes.body}>
        <HomeChatSection />
        <HomeLobbiesSection />
      </div>
    </>
  );
});
