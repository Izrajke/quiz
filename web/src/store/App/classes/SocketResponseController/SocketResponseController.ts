import { SocketResponse, SocketResponseType } from 'api';
import { withDelay } from 'utils';
import { answerDelay } from 'const';

import type { Socket } from '../index';
import type { RoomStore, PlayerStore } from 'store';

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
      case SocketResponseType.answerFirstQuestionType:
      case SocketResponseType.answerSecondQuestionType:
        this.room.setAnswer(data);
        // TODO: раскоментить нижнюю
        // withDelay(this.room.useQuestionModal, answerDelay, [false]);
        break;
      case SocketResponseType.firstQuestionType:
      case SocketResponseType.secondQuestionType:
        // TODO: Убрать проверку
        if (!this.room.answer) {
          // TODO: Перенести это говно на бэк
          withDelay(this.room.setQuestion.bind(this.room), answerDelay, [data]);
          withDelay(this.room.resetAnswer.bind(this.room), answerDelay);
          withDelay(this.room.useQuestionModal.bind(this.room), answerDelay, [
            true,
          ]);
        }
        break;
      case SocketResponseType.playersInfo:
        this.room.setPlayers(data);
        this.player.setPlayerInfo();
        break;
      case SocketResponseType.mapInfo:
        this.room.setMap(data);
        break;
      case SocketResponseType.allowedToCapture:
        this.room.setCaptureCapability(data);
        break;
      case SocketResponseType.attackStage:
        this.room.changeMoveStatus('attack');
        break;
      case SocketResponseType.endGame:
        this.room.setType(SocketResponseType.endGame);
        break;
      default:
        console.log('Неизвестный SocketResponseType');
    }
  }
}
