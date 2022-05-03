import type { FunctionComponent } from 'react';

import { useTable } from 'react-table';

import { observer } from 'mobx-react-lite';

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
}

export const Table: FunctionComponent<TableProps> = observer(
  ({ data, columns, classNames }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable({ data, columns });

    return (
      <div className={classes.wrapper}>
        <table className={classes.table} {...getTableProps()}>
          <thead className={classes.thead}>
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // eslint-disable-next-line
                  <th className={classNames?.th} {...column.getHeaderProps()}>
                    {column.render('header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={classes.tbody} {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                // eslint-disable-next-line
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      // eslint-disable-next-line
                      <td className={classNames?.td} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
);

Table.displayName = 'Table';
