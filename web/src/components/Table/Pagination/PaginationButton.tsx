import { useMemo } from 'react';
import type { FC } from 'react';

import clsx from 'clsx';

import classes from './Pagination.module.css';

interface PaginationButtonProps {
  isActive?: boolean;
  number: number;
  onClick: () => void;
}

export const PaginationButton: FC<PaginationButtonProps> = ({
  isActive = false,
  number,
  onClick,
}) => {
  const styles = useMemo(
    () =>
      clsx(
        classes.paginationButton,
        isActive ? classes.activeButton : classes.normalButton,
      ),
    [isActive],
  );

  return (
    <div onClick={onClick} className={styles}>
      {number}
    </div>
  );
};
