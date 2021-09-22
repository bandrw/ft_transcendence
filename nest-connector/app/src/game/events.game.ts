import { WebSocketGateway } from '@nestjs/websockets';
import {
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { json } from 'express';

@WebSocketGateway()
export class EventsGame
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(GameService)
    private gameService: GameService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  @SubscribeMessage('start')
  launchBall(@MessageBody() user: string) {
    console.log(user);
    const u = JSON.parse(user);
    let i = 0;
    while (i < this.gameService.gamers.length) {
      if (
        this.gameService.gamers[i].playerTwo.user.login === u.login &&
        this.gameService.gamers[i].starterTwo
      ) {
        break;
      } else if (
        this.gameService.gamers[i].playerOne.user.login === u.login &&
        this.gameService.gamers[i].starterOne
      ) {
        break;
      }
      ++i;
    }
  }

  afterInit(server: Server): any {
    this.logger.log('init');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log('client connected: ' + client);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected : ${client.id}`);
  }
}
