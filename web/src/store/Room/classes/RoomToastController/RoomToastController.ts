import { toast } from 'react-toastify';
import { createElement } from 'react';

import type { PlayerColors } from 'api';
import type { RoomStore } from 'store';

import { timeToCapture } from 'const';

export class RoomToastController {
  room: RoomStore;

  constructor(room: RoomStore) {
    this.room = room;
  }

  /** Кто захватывает территорию */
  whoIsCaptureNowToast = (playerColor: PlayerColors) => {
    const playerName = this.room.players.find(
      (player) => playerColor === player.color,
    )?.name;

    if (playerName) {
      toast(`Выбирает ${playerName}`, {
        autoClose: timeToCapture,
        progressStyle: { color: `var(--${playerColor})` },
      });

      toast(
        createElement('span', {}, [
          createElement('span', {}, ['Выбирает ']),
          createElement(
            'strong',
            { style: { color: `var(--${playerColor})` } },
            [playerName],
          ),
        ]),
        {
          autoClose: timeToCapture,
          progressStyle: { color: `var(--${playerColor})` },
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          progressClassName: `toastify-progress-${playerColor}`,
        },
      );
    }
  };
}
