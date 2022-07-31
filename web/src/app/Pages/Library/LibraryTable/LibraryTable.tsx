import { useMemo, useCallback } from 'react';
import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { Paper, Table, Button } from 'components';
import type { TableColumns, TableData, TableClassNames } from 'components';
import { useStore } from 'store';
import { LibraryItem } from 'api';

import { ScoreStars } from './ScoreStars';

import classes from './LibraryTable.module.css';

export const LibraryTable: FunctionComponent = observer(() => {
  const {
    library,
    home: { createLobbyModal },
    dictionaries,
  } = useStore();

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
    (pack: LibraryItem) => () => {
      createLobbyModal.setPackInfo(pack);
      createLobbyModal.setIsOpen();
    },
    [createLobbyModal],
  );
  console.log(library.data);

  const data = useMemo(
    () =>
      library.data.map((pack) => ({
        ...pack,
        categoryId: dictionaries.packTypes.find((type) => type.id === pack.id)
          ?.title,
        title: <Link to={`/pack/${pack.id}`}>{pack.title}</Link>,
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

  return (
    <Paper className={classes.wrapper}>
      <Table
        columns={columns}
        data={data}
        classNames={tableClassNames}
        currentPage={library.currentPage}
        totalPages={library.totalPages}
        setPage={library.setCurrentPage}
      />
    </Paper>
  );
});

LibraryTable.displayName = 'LibraryTable';
