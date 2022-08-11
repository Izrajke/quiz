import type { PlayerStore, RoomStore } from 'store/index';

import type { RoomSocket } from '../RoomSocket';
import { RoomSocketResponse, RoomSocketResponseType } from '../types';

export class RoomSocketResponseController {
  socket: RoomSocket;
  room: RoomStore;
  player: PlayerStore;

  constructor(socket: RoomSocket, room: RoomStore, player: PlayerStore) {
    this.socket = socket;
    this.room = room;
    this.player = player;
  }

  control(data: RoomSocketResponse) {
    switch (data.type) {
      case RoomSocketResponseType.firstQuestionType:
      case RoomSocketResponseType.secondQuestionType:
        this.room.setQuestion(data);
        this.room.resetAnswer();
        this.room.useQuestionModal(true);
        break;
      case RoomSocketResponseType.answerFirstQuestionType:
      case RoomSocketResponseType.answerSecondQuestionType:
        this.room.setAnswer(data);
        break;
      case RoomSocketResponseType.playersInfo:
        this.room.setPlayers(data);
        this.player.setPlayerInfo();
        break;
      case RoomSocketResponseType.mapInfo:
        this.room.setMap(data);
        break;
      case RoomSocketResponseType.captureTurnQueue:
        this.room.setTurnQueue(data);
        break;
      case RoomSocketResponseType.attackTurnQueue:
        this.room.setMoveStatus('attack');
        this.room.setTurnQueue(data);
        break;
      case RoomSocketResponseType.currentTurnIndex:
        this.room.setCurrentTurn(data);
        break;
      case RoomSocketResponseType.allowedToCapture:
        this.room.useQuestionModal(false);
        this.room.setCaptureCapability(data);
        break;
      case RoomSocketResponseType.attackStage:
        this.room.setMoveStatus('attack');
        break;
      case RoomSocketResponseType.endGame:
        this.room.setType(RoomSocketResponseType.endGame);
        break;
      default:
        console.log('Неизвестный SocketResponseType');
    }
  }
}
