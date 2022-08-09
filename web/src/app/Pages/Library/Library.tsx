import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { CreateRoomModal } from 'components';
import { useStore } from 'store';

import { LibraryTable } from './LibraryTable';

import classes from './Library.module.css';

export const Library: FunctionComponent = observer(() => {
  const { library } = useStore();

  useEffect(() => {
    library.load();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <CreateRoomModal />
      <LibraryTable />
    </div>
  );
});

Library.displayName = 'Library';
