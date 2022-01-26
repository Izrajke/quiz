import {useEffect, useMemo} from 'react';
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
    indexI: number,
    indexJ: number
}

export interface ICell extends FunctionComponent<ICellProps> {
    displayName?: string;
}

/** Клетка на поле */
export const Cell: ICell = observer(({
                                         className,
                                         isExists,
                                         owner,
                                         indexI,
                                         indexJ
                                     }) => {
    const styles = useMemo(
        () => clsx(
            className,
            !isExists && classes.none,
            isExists && !owner && classes.empty,
            isExists && owner && classes[owner]
        ),
        [className, isExists, owner],
    );

    const {app} = useStore();

    useEffect(() => {
        app.socketConnection();
    }, [app]);

    /** Отправляем сообщение о получении или о захвате клетки */
    const clickHandle = () => {
        app.socketMessage({type: TSocketRequestType.attackCell, playerId: "3333-4444-5555", indexI: indexI, indexJ: indexJ})
    };

    // TODO Завязка на isExists пока не доработана логика нападения на противника
    return (
        <svg className={styles} width="88" height="100" viewBox="0 0 88 100">
            <path {...(isExists && {onClick: clickHandle})}
                  d="M43.3013 0L86.6025 25V75L43.3013 100L0 75V25L43.3013 0Z"
            />
        </svg>
    );
});

Cell.displayName = 'Cell';
