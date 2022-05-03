import { useMemo } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Table, Button } from 'components';
import type { TableColumns, TableData, TableClassNames } from 'components';
import { useStore } from 'store';

import { ScoreStars } from './ScoreStars';

import classes from './LibraryTable.module.css';

export const LibraryTable: FunctionComponent = observer(() => {
  const { library } = useStore();

  const columns = useMemo<TableColumns[]>(
    () => [
      {
        header: 'Название пака',
        accessor: 'name',
      },
      {
        header: 'Тематика',
        accessor: 'type',
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

  const data = useMemo(
    () =>
      library.data.map((pack) => ({
        ...pack,
        score: <ScoreStars score={pack.score} />,
        actions: (
          <Button type="default" className={classes.createLobbyButton}>
            Создать лобби
          </Button>
        ),
      })),
    [library.data],
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
      <Table columns={columns} data={data} classNames={tableClassNames} />
    </Paper>
  );
});

LibraryTable.displayName = 'LibraryTable';
