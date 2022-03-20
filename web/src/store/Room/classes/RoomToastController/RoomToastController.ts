import { toast } from 'react-toastify';
import { createElement } from 'react';
import type { ReactText } from 'react';

import type { PlayerColors } from 'api';
import type { RoomStore } from 'store';

import { makeObservable, observable, action } from 'mobx';

import { timeToCapture } from 'const';

export class RoomToastController {
  room: RoomStore;
  toastId: ReactText | null = null;

  constructor(room: RoomStore) {
    makeObservable(this, {
      /** observable */
      toastId: observable,
      /** action */
      setToastId: action,
      dismissToast: action,
    });
    this.room = room;
  }

  /** Установить текущий id уведомления */
  setToastId = (id: ReactText) => {
    this.toastId = id;
  };

  /** Закрыть окно текущего уведомления */
  dismissToast = () => {
    if (this.toastId) {
      toast.dismiss(this.toastId);
    }
    this.toastId = null;
  };

  /** Кто захватывает территорию */
  whoIsCaptureNowToast = (playerColor: PlayerColors) => {
    const playerName = this.room.players.find(
      (player) => playerColor === player.color,
    )?.name;

    if (playerName) {
      const id = toast(
        createElement('span', {}, [
          createElement('span', { key: '1' }, ['Выбирает ']),
          createElement(
            'strong',
            { style: { color: `var(--${playerColor})` }, key: '2' },
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
      this.setToastId(id);
    }
  };
}
