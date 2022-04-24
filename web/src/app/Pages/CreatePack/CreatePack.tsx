import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Header } from 'components';

import { CreatePackMainSection } from './CreatePackMainSection';

import classes from './CreatePack.module.css';

export const CreatePack: FunctionComponent = observer(() => {
  return (
    <div className={classes.root}>
      <Header />
      <CreatePackMainSection />
    </div>
  );
});

CreatePack.displayName = 'CreatePack';
