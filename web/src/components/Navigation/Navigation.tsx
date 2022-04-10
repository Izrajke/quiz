import type { FunctionComponent } from 'react';

import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Typography } from 'components';

import classes from './Navigation.module.css';

export const Navigation: FunctionComponent = observer(() => {
  return (
    <div className={classes.navigation}>
      <Link to={'createPack'}>
        <Typography.Text color="white" type="text-0">
          Создать пак
        </Typography.Text>
      </Link>
      <Link to={'/'}>
        <Typography.Text color="white" type="text-0">
          Об игре
        </Typography.Text>
      </Link>
    </div>
  );
});

Navigation.displayName = 'Navigation';
