import { useMemo } from 'react';
import type { FC } from 'react';

import { useLocation } from 'react-router';

import { Header } from '../Header';

import classes from './Layout.module.css';

/** Пути на которых Layout не нужен */
const excludedPaths = ['/room/'];

export const Layout: FC = ({ children }) => {
  const { pathname } = useLocation();

  const isLayoutAvailableAtCurrentPath = useMemo(
    () => excludedPaths.find((path) => !pathname.includes(path)),
    [pathname],
  );

  if (!isLayoutAvailableAtCurrentPath) {
    return <>{children}</>;
  }

  return (
    <div className={classes.wrapper}>
      <Header />
      <div className={classes.content}>{children}</div>
    </div>
  );
};
