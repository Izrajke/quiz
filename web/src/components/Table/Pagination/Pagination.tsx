import { FC, useMemo } from 'react';


import { Typography } from 'components';

import classes from './Pagination.module.css';
import { PaginationButton } from './PaginationButton';
import { makeRenderPaginationArray } from './utils';

interface PaginationProps {
  current: number;
  total: number;
  onItemClick: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  current,
  total,
  onItemClick,
}) => {
  const renderArray = useMemo(
    () => makeRenderPaginationArray(current, total),
    [current, total],
  );

  return (
    <div className={classes.wrapper}>
      {renderArray.map((page) =>
        page ? (
          <PaginationButton
            onClick={() => {
              onItemClick(page);
            }}
            number={page}
            isActive={page === current}
          />
        ) : (
          <Typography.Text color="white-50" type="caption">
            ...
          </Typography.Text>
        ),
      )}
    </div>
  );
};
