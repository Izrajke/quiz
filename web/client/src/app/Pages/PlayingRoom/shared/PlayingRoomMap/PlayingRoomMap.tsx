import type {FunctionComponent} from 'react';

import {observer} from 'mobx-react-lite';

import {Map} from 'components';
import type {TMap} from 'components';

import classes from './PlayingRoomMap.module.css';

/** Карта */
const PlayingMap: TMap = [
    [ // 1
        { // 1
            isExists: false,
        },
        { // 2
            isExists: false,
        },
        { // 3
            isExists: false,
        },
        { // 4
            isExists: false,
        },
        { // 5
            isExists: false,
        },
    ],
    [ // 2
        { // 1
            isExists: false,
        },
        { // 2
            isExists: false,
        },
        { // 3
            isExists: true,
            owner: null
        },
        { // 4
            isExists: true,
            owner: 'player-2'
        },
        { // 5
            isExists: true,
            owner: 'player-2'
        },
    ],
    [ // 3
        { // 1
            isExists: false,
        },
        { // 2
            isExists: true,
            owner: 'player-1'
        },
        { // 3
            isExists: true,
            owner: null
        },
        { // 4
            isExists: true,
            owner: null
        },
        { // 5
            isExists: true,
            owner: 'player-2'
        },
    ],
    [ // 4
        { // 1
            isExists: true,
            owner: 'player-1'
        },
        { // 2
            isExists: true,
            owner: 'player-1'
        },
        { // 3
            isExists: true,
            owner: null
        },
        { // 4
            isExists: true,
            owner: null
        },
        { // 5
            isExists: true,
            owner: 'player-3'
        },
    ],
    [ // 5
        { // 1
            isExists: true,
            owner: 'player-1'
        },
        { // 2
            isExists: true,
            owner: null
        },
        { // 3
            isExists: false,
        },
        { // 4
            isExists: true,
            owner: 'player-3'
        },
        { // 5
            isExists: false,
        },
    ],
];

export const PlayingRoomMap: FunctionComponent = observer(() => {
    return (
        <div className={classes.wrapper}>
            <Map>
                {PlayingMap.map((row, i) => (
                    <Map.Row rowNumber={i} key={Math.random()}>
                        {row.map((cell, j) => (
                            <Map.Cell isExists={cell.isExists} owner={cell.owner} indexI={i} indexJ={j} key={Math.random()}/>
                        ))}
                    </Map.Row>
                ))}
            </Map>
        </div>
    );
});

PlayingRoomMap.displayName = 'PlayingRoomMap';
