import { useMemo, useCallback } from 'react';
import type { FunctionComponent, MouseEventHandler } from 'react';

import { useNavigate } from 'react-router';

import { observer } from 'mobx-react-lite';

import type { LibraryItem } from 'api';
import { Paper, Table, Button } from 'components';
import type { TableColumns, TableData, TableClassNames } from 'components';
import { useStore } from 'store';

import classes from './LibraryTable.module.css';
import { ScoreStars } from './ScoreStars';


export const LibraryTable: FunctionComponent = observer(() => {
  const {
    library,
    home: { createLobbyModal },
    dictionaries,
  } = useStore();
  const navigate = useNavigate();

  const columns = useMemo<TableColumns[]>(
    () => [
      {
        header: 'Название пака',
        accessor: 'title',
      },
      {
        header: 'Тематика',
        accessor: 'categoryId',
      },
      {
        header: 'Оценка',
        accessor: 'score',
      },
      {
        header: 'Действия',
        accessor: 'actions',
      },
    ],
    [],
  );

  const onChoosePackHandler = useCallback(
    (pack: LibraryItem): MouseEventHandler<HTMLButtonElement> =>
      (e) => {
        e.stopPropagation();
        createLobbyModal.setPackInfo(pack);
        createLobbyModal.setIsOpen();
      },
    [createLobbyModal],
  );

  const data = useMemo(
    () =>
      library.data.map((pack) => ({
        ...pack,
        categoryId: dictionaries.packTypes.find(
          (type) => type.id === pack.categoryId,
        )?.title,
        score: <ScoreStars score={pack.rating} />,
        actions: (
          <Button
            type="default"
            className={classes.createLobbyButton}
            onClick={onChoosePackHandler(pack)}
          >
            Выбрать для игры
          </Button>
        ),
      })),
    [library.data, onChoosePackHandler, dictionaries.packTypes],
  ) as unknown as TableData[];

  const tableClassNames = useMemo<TableClassNames>(
    () => ({
      td: classes.td,
      th: classes.th,
    }),
    [],
  );

  const onRowClick = useCallback(
    (id: string) => {
      navigate(`/pack/${id}`);
    },
    [navigate],
  );

  return (
    <Paper>
      <Table
        columns={columns}
        data={data}
        classNames={tableClassNames}
        currentPage={library.currentPage}
        totalPages={library.totalPages}
        setPage={library.setCurrentPage}
        onRowClick={onRowClick}
      />
    </Paper>
  );
});

LibraryTable.displayName = 'LibraryTable';
