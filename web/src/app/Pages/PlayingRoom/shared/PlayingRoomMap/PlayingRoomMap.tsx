import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Map } from 'components';

import classes from './PlayingRoomMap.module.css';
import { computed } from "mobx";
import { useStore } from "../../../../../store";

export const PlayingRoomMap: FunctionComponent = observer(() => {
    const { app } = useStore();

    const mapArray = computed(() => {
        return app.room.map;
    }).get();

    return (
        <div className={classes.wrapper}>
            <Map>
                {mapArray.map((row, i) => (
                    <Map.Row rowIndex={i} key={Math.random()}>
                        {row.map((cell, j) => (
                            <Map.Cell isExists={cell.isExists} owner={cell.owner} rowIndex={i} cellIndex={j} key={Math.random()}/>
                        ))}
                    </Map.Row>
                ))}
            </Map>
        </div>
    );
});

PlayingRoomMap.displayName = 'PlayingRoomMap';
