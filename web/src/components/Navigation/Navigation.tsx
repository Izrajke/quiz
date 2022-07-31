import { memo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { NavigationItem } from './NavigationItem';

import classes from './Navigation.module.css';

export enum NavigationPathways {
  home = '/',
  createPack = '/pack/create',
  aboutGame = '/about',
  library = '/library',
}

interface NavigationRoute {
  name: string;
  path: NavigationPathways;
}

const routes: NavigationRoute[] = [
  {
    name: 'Главная',
    path: NavigationPathways.home,
  },
  {
    name: 'Создать пак',
    path: NavigationPathways.createPack,
  },
  {
    name: 'Об игре',
    path: NavigationPathways.aboutGame,
  },
  {
    name: 'Библиотека паков',
    path: NavigationPathways.library,
  },
];

export const Navigation: FunctionComponent = memo(
  observer(() => {
    return (
      <div className={classes.navigation}>
        {routes.map((route) => (
          <NavigationItem key={route.name} {...route} />
        ))}
      </div>
    );
  }),
);

Navigation.displayName = 'Navigation';
