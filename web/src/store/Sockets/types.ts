import * as HomeSocket from './HomeSocket/types';
import * as RoomSocket from './RoomSocket/types';

/** ------------------------------------------------------------ */
/** Logger */

/** Кто адресат */
export type SocketSendingType = 'sent' | 'received';

/** Массив произошедших событий в сокете */
export type SocketLog = [
  SocketSendingType,
  (
    | RoomSocket.RoomSocketRequest
    | RoomSocket.RoomSocketResponse
    | HomeSocket.HomeSocketResponse
    | HomeSocket.HomeSocketRequest
  ),
][];
