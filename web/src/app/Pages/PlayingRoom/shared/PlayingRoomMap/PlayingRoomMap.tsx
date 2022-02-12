import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from 'store';

import { MapComponent } from 'components';

import classes from './PlayingRoomMap.module.css';

export const PlayingRoomMap: FunctionComponent = observer(() => {
  const { room } = useStore();

  return (
    <div className={classes.wrapper}>
      <MapComponent>
        {room.map.map((row, i) => (
          <MapComponent.Row rowIndex={i} key={Math.random()}>
            {row.map((cell, j) => (
              <MapComponent.Cell
                isExists={cell.isExists}
                owner={cell.owner}
                rowIndex={i}
                cellIndex={j}
                canMove={cell.canMove}
                key={Math.random()}
              />
            ))}
          </MapComponent.Row>
        ))}
      </MapComponent>
    </div>
  );
});

PlayingRoomMap.displayName = 'PlayingRoomMap';
