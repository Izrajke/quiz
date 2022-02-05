import {useMemo} from 'react';
import type {FunctionComponent} from 'react';

import clsx from 'clsx';
import {observer} from 'mobx-react-lite';

import classes from './Map.module.css';
import {useStore} from "../../store";
import {TSocketRequestType} from "../../api";

export interface ICellProps {
    className?: string;
    isExists: boolean,
    owner: string | undefined | null;
    /** Индексы матрицы клеток */
    rowIndex: number,
    cellIndex: number
}

export interface ICell extends FunctionComponent<ICellProps> {
    displayName?: string;
}

/** Клетка на поле */
export const Cell: ICell = observer(({
                                         className,
                                         isExists,
                                         owner,
                                         rowIndex,
                                         cellIndex
                                     }) => {
    const styles = useMemo(
        () => clsx(
            className,
            isExists ? owner && classes[owner] : classes.none
        ),
        [className, isExists, owner],
    );

    const {app} = useStore();

    /** Отправляем сообщение о получении или о захвате клетки */
    const clickHandle = () => {
        app.socketMessage({type: TSocketRequestType.getCell, rowIndex: rowIndex, cellIndex: cellIndex})
    };

    // TODO Завязка на isExists пока не доработана логика нападения на противника
    return (
        <svg className={styles} width="88" height="100" viewBox="0 0 88 100">
            <path onClick={isExists ? clickHandle : undefined}
                  d="M43.3013 0L86.6025 25V75L43.3013 100L0 75V25L43.3013 0Z"
            />
        </svg>
    );
});

Cell.displayName = 'Cell';
