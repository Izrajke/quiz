import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { Map } from 'components';

import classes from './PlayingRoomMap.module.css';

export const PlayingRoomMap: FunctionComponent = observer(() => {
  const { app } = useStore();

  return (
    <div className={classes.wrapper}>
      <Map>
        {app.room.map.map((row, i) => (
          <Map.Row rowIndex={i} key={Math.random()}>
            {row.map((cell, j) => (
              <Map.Cell
                isExists={cell.isExists}
                owner={cell.owner}
                rowIndex={i}
                cellIndex={j}
                canMove={cell.canMove}
                key={Math.random()}
              />
            ))}
          </Map.Row>
        ))}
      </Map>
    </div>
  );
});

PlayingRoomMap.displayName = 'PlayingRoomMap';
