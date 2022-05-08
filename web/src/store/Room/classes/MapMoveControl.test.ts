import type { RoomMapData, PlayerColors } from 'store/Sockets/RoomSocket/types';

import type { CaptureCheckNames } from './MapMoveControl';
import { MapMoveControl } from './MapMoveControl';

describe('UNIT: MapMoveControl', () => {
  const player: PlayerColors = 'player-2';
  const mockMap: RoomMapData = [
    [
      {
        isExists: true,
        owner: 'player-2',
      },
      {
        isExists: true,
        owner: 'player-2',
      },
    ],
    [
      {
        isExists: true,
        owner: 'player-1',
      },
      {
        isExists: true,
        owner: 'empty',
      },
    ],
    [
      {
        isExists: true,
        owner: 'empty',
      },
      {
        isExists: true,
        owner: 'empty',
      },
    ],
    [
      {
        isExists: false,
        owner: 'empty',
      },
      {
        isExists: false,
        owner: 'empty',
      },
    ],
  ];

  const testMapMoveControl = (moveStatus: CaptureCheckNames) => {
    return mockMap.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const moveControl = new MapMoveControl(
          mockMap,
          rowIndex,
          cellIndex,
          player,
        );
        return {
          ...cell,
          canMove: moveControl.checks[moveStatus](),
        };
      }),
    );
  };

  test('FreeCapture', () => {
    const moveStatus: CaptureCheckNames = 'freeCapture';

    const result = testMapMoveControl(moveStatus);

    expect(result[2][1].canMove).toBe(true);
    expect(result[1][0].canMove).toBe(false);
    expect(result[3][1].canMove).toBe(false);
  });

  test('Capture', () => {
    const moveStatus: CaptureCheckNames = 'capture';

    const result = testMapMoveControl(moveStatus);

    expect(result[1][1].canMove).toBe(true);
    expect(result[2][1].canMove).toBe(false);
  });

  test('Attack', () => {
    const moveStatus: CaptureCheckNames = 'attack';

    const result = testMapMoveControl(moveStatus);

    expect(result[1][0].canMove).toBe(true);
    expect(result[2][1].canMove).toBe(false);
    expect(result[3][1].canMove).toBe(false);
  });
});
