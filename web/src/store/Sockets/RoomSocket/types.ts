/** ------------------------------------------------------------ */
/** Типы и интерфейсы сокета */

/** Типы вопросов */
export enum RoomSocketResponseType {
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
  /** Очередь ходов при "захвате" */
  captureTurnQueue = 8,
  /** Очередь ходов при "атаке" */
  attackTurnQueue = 9,
  /** Индекс текущего хода */
  currentTurnIndex = 10,
  /** Информация о игроках */
  playersInfo = 12,
  /** Информация о карте */
  mapInfo = 13,
  /** Начало этапа нападения */
  attackStage = 15,
  /** Конец игры */
  endGame = 999,
}

export enum RoomSocketRequestType {
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
export interface RoomSocketOptions {
  [key: string]: string;
}

/** Интерфейс тела вопроса */
export interface RoomSocketQuestion {
  title: string;
  options?: RoomSocketOptions;
}

/** Интерфейс вопроса */
export interface SocketQuestionData {
  type: RoomSocketResponseType;
  question: RoomSocketQuestion;
}

export interface RoomSocketAllowedToCaptureData {
  type: RoomSocketResponseType;
  color: PlayerColors;
  count: number;
}

export interface RoomAnswerOptions {
  name: string;
  color: PlayerColors;
  value: number;
  time: number;
}

/** Порядок ходов стадии "freeCapture/capture" */
export interface RoomTurnQueueData {
  type: RoomSocketResponseType;
  turns: number | PlayerColors[];
}

/** Текущий номер хода */
export interface RoomCurrentTurnData {
  type: RoomSocketResponseType;
  number: number;
}

/** Интерфейс ответа на вопрос */
export interface RoomSocketAnswerData {
  type: RoomSocketResponseType;
  answer: {
    value: string;
  };
  options?: RoomAnswerOptions[];
}

/** Интерфейс игрока */
export interface RoomPlayer {
  id: string;
  name: string;
  points: number;
  color: PlayerColors;
  avatar: string;
}

/** Информация о игроках */
export interface RoomSocketPlayersData {
  type: RoomSocketResponseType;
  players: RoomPlayer[];
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Карта */

/** Владелец ячейки */
export type RoomCellOwner = PlayerColors | 'empty';

/** Ячейка карты */
export interface RoomCellData {
  /** Доступна ли для игры клетка */
  isExists: boolean;
  /** Владелец */
  owner: RoomCellOwner;
}

/** Row */
export type RoomRowData = RoomCellData[];

/** Карта */
export type RoomMapData = RoomRowData[];

/** Информация о карте */
export interface SocketMapData {
  type: RoomSocketResponseType;
  map: RoomMapData;
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Клиентские */

/** Интерфейс отправки ответа с клиента */
export interface RoomSocketAnswer {
  type: RoomSocketRequestType;
  option: string;
}

/** Получить вопрос */
export interface RoomSocketGetQuestion {
  type: RoomSocketRequestType;
}

export interface RoomSocketAttackCell {
  type: RoomSocketRequestType;
  rowIndex: number;
  cellIndex: number;
}

/** ------------------------------------------------------------ */

export type RoomSocketResponse = RoomSocketAnswerData &
  RoomSocketPlayersData &
  SocketQuestionData &
  SocketMapData &
  RoomSocketAllowedToCaptureData &
  RoomTurnQueueData &
  RoomCurrentTurnData;

export type RoomSocketRequest =
  | RoomSocketAnswer
  | RoomSocketGetQuestion
  | RoomSocketAttackCell;
