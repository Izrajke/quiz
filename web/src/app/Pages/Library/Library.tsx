import type { FunctionComponent } from 'react';

import { Paper, Header } from 'components';

import { observer } from 'mobx-react-lite';

import classes from './Library.module.css';

export const Library: FunctionComponent = observer(() => {
  return (
    <div className={classes.root}>
      <Header />
      <Paper className={classes.wrapper}></Paper>
    </div>
  );
});

Library.displayName = 'Library';
