import { useCallback } from 'react';
import type { FunctionComponent } from 'react';

import { useTable } from 'react-table';

import { observer } from 'mobx-react-lite';

import { Pagination } from './Pagination';

import classes from './Table.module.css';

export interface TableData {
  [key: string]: string;
}

export interface TableColumns {
  header: string;
  accessor: string;
}

export interface TableClassNames {
  th?: string;
  td?: string;
}

export interface TableProps {
  data: TableData[];
  columns: TableColumns[];
  classNames?: TableClassNames;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  onRowClick: (id: string) => void;
}

export const Table: FunctionComponent<TableProps> = observer(
  ({
    data,
    columns,
    classNames,
    currentPage,
    totalPages,
    setPage,
    onRowClick,
  }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({ data, columns });

    const onRowClickHandler = useCallback(
      (id: string) => () => {
        onRowClick(id);
      },
      [onRowClick],
    );

    return (
      <div className={classes.tableWrapper}>
        <table className={classes.table} {...getTableProps()}>
          <thead className={classes.thead}>
            {headerGroups.map((headerGroup) => {
              return (
                // eslint-disable-next-line
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      className={classNames?.th}
                      {...column.getHeaderProps()}
                      key={column.id}
                    >
                      {column.render('header')}
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
        </table>
        <div className={classes.tableContent}>
          <table className={classes.table} {...getTableProps()}>
            <tbody className={classes.tbody} {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.original.id}
                    onClick={onRowClickHandler(row.original.id)}
                  >
                    {row.cells.map((cell) => (
                      // eslint-disable-next-line
                      <td className={classNames?.td} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          total={totalPages}
          onItemClick={setPage}
        />
      </div>
    );
  },
);

Table.displayName = 'Table';
