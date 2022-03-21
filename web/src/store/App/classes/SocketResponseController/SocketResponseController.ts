import { SocketResponse, SocketResponseType } from 'api';
import type { Socket } from '../index';
import type { PlayerStore, RoomStore } from 'store';

export class SocketResponseController {
  socket: Socket;
  room: RoomStore;
  player: PlayerStore;

  constructor(socket: Socket, room: RoomStore, player: PlayerStore) {
    this.socket = socket;
    this.room = room;
    this.player = player;
  }

  control(data: SocketResponse) {
    switch (data.type) {
      case SocketResponseType.firstQuestionType:
      case SocketResponseType.secondQuestionType:
        this.room.setQuestion(data);
        this.room.resetAnswer();
        this.room.useQuestionModal(true);
        break;
      case SocketResponseType.answerFirstQuestionType:
      case SocketResponseType.answerSecondQuestionType:
        this.room.setAnswer(data);
        break;
      case SocketResponseType.playersInfo:
        this.room.setPlayers(data);
        this.player.setPlayerInfo();
        break;
      case SocketResponseType.mapInfo:
        this.room.setMap(data);
        break;
      case SocketResponseType.captureTurnQueue:
        this.room.setTurnQueue(data);
        break;
      case SocketResponseType.attackTurnQueue:
        this.room.setTurnQueue(data);
        // this.room.setMoveStatus('attack');
        break;
      case SocketResponseType.currentTurnIndex:
        this.room.setCurrentTurn(data);
        break;
      case SocketResponseType.allowedToCapture:
        this.room.useQuestionModal(false);
        this.room.setCaptureCapability(data);
        break;
      case SocketResponseType.attackStage:
        this.room.setMoveStatus('attack');
        break;
      case SocketResponseType.endGame:
        this.room.setType(SocketResponseType.endGame);
        break;
      default:
        console.log('Неизвестный SocketResponseType');
    }
  }
}
