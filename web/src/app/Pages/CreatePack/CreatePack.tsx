import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Header } from 'components';
import { useStore } from 'store';

import { CreatePackMainSection } from './CreatePackMainSection';
import { CreatePackQuestionSection } from './CreatePackQuestionSection';

import classes from './CreatePack.module.css';

export const CreatePack: FunctionComponent = observer(() => {
  const { createPack } = useStore();

  useEffect(() => {
    createPack.init();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <CreatePackMainSection />
      <CreatePackQuestionSection />
    </div>
  );
});

CreatePack.displayName = 'CreatePack';
