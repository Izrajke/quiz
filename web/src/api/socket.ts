/** ------------------------------------------------------------ */
/** Типы и интерфейсы сокета */

/** Типы вопросов */
export enum TSocketResponseType {
  /** Обычный вопрос с 4-мя вариантами ответа */
  firstQuestionType = 1,
  /** Вопрос без вариантов ответа */
  secondQuestionType = 2,
  /** Ответ на вопрос первого типа */
  answerFirstQuestionType = 5,
  /** Ответ на вопрос второго типа */
  answerSecondQuestionType = 6,
  /** Информация о игроках */
  playersInfo = 12,
  /** Информация о карте */
  mapInfo = 13,
  /** Конец игры */
  endGame = 999,
}

export enum TSocketRequestType {
  /** Отправить ответ */
  sendAnswer = 1,
  /** Получить вопрос */
  getQuestion = 2,
  /** Получить клетку */
  getCell = 3,
  /** Напасть на клетку */
  attackCell = 4,
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Серверные */

/** Интерфейс объекта вариантов ответ */
export interface ISocketOptions {
  [key: string]: string;
}

/** Интерфейс тела вопроса */
export interface ISocketQuestion {
  title: string;
  options: ISocketOptions;
}

/** Интерфейс вопроса */
export interface ISocketQuestionData {
  type: TSocketResponseType;
  question: ISocketQuestion;
}

/** Интерфейс ответа на вопрос */
export interface ISocketAnswerData {
  type: TSocketResponseType;
  answer: {
    value: string;
  };
}

export type PlayerColors = 'player-1' | 'player-2' | 'player-3';

/** Интерфейс игрока */
export interface IPlayer {
  id: string;
  name: string;
  points: number;
  color: PlayerColors;
}

/** Информация о игроках */
export interface ISocketPlayersData {
  type: TSocketResponseType;
  players: IPlayer[];
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
  owner?: CellOwner;
}

/** Row */
export type RowData = CellData[];

/** Карта */
export type MapData = RowData[];

/** Информация о карте */
export interface SocketMapData {
  type: TSocketResponseType;
  map: MapData;
}

/** - - - - - - - - - - - - - - - - - - - - - - - - */
/** Клиентские */

/** Интерфейс отправки ответа с клиента */
export interface ISocketAnswer {
  type: TSocketResponseType;
  option: string;
}

/** ------------------------------------------------------------ */
/** Logger */

/** Все возмоные интерфейсы отправки сокетов */
export type TSocketAction =
  | ISocketAnswer
  | ISocketQuestionData
  | ISocketAnswerData;

/** ------------------------------------------------------------ */
/** Logger */

/** Кто адресат */
export type TSocketSendingType = 'sent' | 'received';
/** Массив произошедших событий в сокете */
export type TSocketLog = [TSocketSendingType, TSocketAction][];
