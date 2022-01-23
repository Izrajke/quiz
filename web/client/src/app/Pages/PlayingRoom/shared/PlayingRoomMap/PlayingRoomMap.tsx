import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Map } from 'components';
import type { TMap } from 'components';

import classes from './PlayingRoomMap.module.css';

/** Карта */
const PlayingMap: TMap = [
  [
    { owner: 'player-1' },
    { owner: 'player-1' },
    { owner: 'player-3' },
    { owner: 'player-3' },
    { owner: 'player-3' },
  ],
  [
    { owner: null },
    { owner: 'player-1' },
    { owner: null },
    { owner: 'player-1' },
    { owner: null },
    { owner: null },
    { owner: null },
    { owner: null },
  ],
  [
    { owner: null },
    { owner: 'player-2' },
    { owner: null },
    { owner: null },
    { owner: 'player-2' },
    { owner: null },
    { owner: null },
  ],
  [
    { owner: 'player-1' },
    { owner: 'player-2' },
    { owner: 'player-2' },
    { owner: 'player-1' },
    { owner: null },
  ],
  [
    { owner: 'player-2' },
    { owner: 'player-2' },
    { owner: 'player-2' },
    { owner: null },
    { owner: 'player-1' },
  ],
];

export const PlayingRoomMap: FunctionComponent = observer(() => {
  return (
    <div className={classes.wrapper}>
      <Map>
        {PlayingMap.map((row, i) => (
          <Map.Row rowNumber={++i} key={Math.random()}>
            {row.map((cell) => (
              <Map.Cell owner={cell.owner} key={Math.random()} />
            ))}
          </Map.Row>
        ))}
      </Map>
    </div>
  );
});

PlayingRoomMap.displayName = 'PlayingRoomMap';
