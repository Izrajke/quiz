import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { Paper, Header } from 'components';
import { useStore } from 'store';

import { observer } from 'mobx-react-lite';

import classes from './Library.module.css';

export const Library: FunctionComponent = observer(() => {
  const { library } = useStore();

  useEffect(() => {
    library.load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <Paper className={classes.wrapper}></Paper>
    </div>
  );
});

Library.displayName = 'Library';
