import { useMemo } from 'react';
import type { FunctionComponent } from 'react';


import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { Typography } from 'components';

import { NavigationPathways } from './Navigation';
import classes from './Navigation.module.css';

interface NavigationItem {
  name: string;
  path: NavigationPathways;
}

export const NavigationItem: FunctionComponent<NavigationItem> = observer(
  ({ path, name }) => {
    const { pathname } = useLocation();

    const isActive = useMemo(() => path === pathname, [path, pathname]);

    return (
      <Link key={path} to={path} className={clsx(isActive && classes.disabled)}>
        <Typography.Text color={isActive ? 'white-50' : 'white'} type="text-0">
          {name}
        </Typography.Text>
      </Link>
    );
  },
);

NavigationItem.displayName = 'NavigationItem';
