/** ------------------------------------------------------------ */
/** Типы и интерфейсы сокета */

/** Типы вопросов */
export enum SocketResponseType {
  /** Обычный вопрос с 4-мя вариантами ответа */
  firstQuestionType = 1,
  /** Вопрос без вариантов ответа */
  secondQuestionType = 2,
  /** Ответ на вопрос первого типа */
  answerFirstQuestionType = 5,
  /** Ответ на вопрос второго типа */
  answerSecondQuestionType = 6,
  /** Кол-во территории для захвата */
  allowedToCapture = 7,
  /** Информация о игроках */
  playersInfo = 12,
  /** Информация о карте */
  mapInfo = 13,
  /** Начало этапа нападения */
  attackStage = 15,
  /** Конец игры */
  endGame = 999,
}

export enum SocketRequestType {
  /** Отправить ответ */
  sendAnswer = 1,
  /** Получить вопрос */
  getQuestion = 2,
  /** Получить пустую клетку */
  getCell = 3,
  /** Напасть на клетку */
  attackCell = 4,
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Серверные */

export type PlayerColors = 'player-1' | 'player-2' | 'player-3';

/** Интерфейс объекта вариантов ответ */
export interface SocketOptions {
  [key: string]: string;
}

/** Интерфейс тела вопроса */
export interface SocketQuestion {
  title: string;
  options: SocketOptions;
}

/** Интерфейс вопроса */
export interface SocketQuestionData {
  type: SocketResponseType;
  question: SocketQuestion;
}

export interface SocketAllowedToCaptureData {
  type: SocketResponseType;
  color: PlayerColors;
  count: number;
}

export interface AnswerOptions {
  name: string;
  color: PlayerColors;
  value: number;
  time: number;
}

/** Интерфейс ответа на вопрос */
export interface SocketAnswerData {
  type: SocketResponseType;
  answer: {
    value: string;
  };
  options?: AnswerOptions;
}

/** Интерфейс игрока */
export interface Player {
  id: string;
  name: string;
  points: number;
  color: PlayerColors;
}

/** Информация о игроках */
export interface SocketPlayersData {
  type: SocketResponseType;
  players: Player[];
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Карта */

/** Владелец ячейки */
export type CellOwner = 'player-1' | 'player-2' | 'player-3' | 'empty';

/** Ячейка карты */
export interface CellData {
  /** Доступна ли для игры клетка */
  isExists: boolean;
  /** Владелец */
  owner: CellOwner;
}

/** Row */
export type RowData = CellData[];

/** Карта */
export type MapData = RowData[];

/** Информация о карте */
export interface SocketMapData {
  type: SocketResponseType;
  map: MapData;
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Клиентские */

/** Интерфейс отправки ответа с клиента */
export interface SocketAnswer {
  type: SocketRequestType;
  option: string;
}

/** Получить вопрос */
export interface SocketGetQuestion {
  type: SocketRequestType;
}

export interface SocketAttackCell {
  type: SocketRequestType;
  rowIndex: number;
  cellIndex: number;
}

/** ------------------------------------------------------------ */

export type SocketResponse = SocketAnswerData &
  SocketPlayersData &
  SocketQuestionData &
  SocketMapData &
  SocketAllowedToCaptureData;

export type SocketRequest = SocketAnswer | SocketGetQuestion | SocketAttackCell;

/** ------------------------------------------------------------ */
/** Logger */

/** Кто адресат */
export type SocketSendingType = 'sent' | 'received';
/** Массив произошедших событий в сокете */
export type SocketLog = [SocketSendingType, SocketRequest | SocketResponse][];
