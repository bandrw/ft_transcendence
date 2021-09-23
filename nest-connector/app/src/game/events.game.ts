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
  launchBall(player: Socket, @MessageBody() user: string) {
    console.log(user);
    const u = JSON.parse(user);
    this.logger.log(player);
    if (this.gameService.gamers[u.id].playerTwo.user.login === u.login) {
      this.gameService.gamers[u.id].playerOne.user.resp.write(
        `event: bellLaunch\ndata: \n\n`,
      );
    } else {
      this.gameService.gamers[u.id].playerTwo.user.resp.write(
        `event: bellLaunch\ndata: \n\n`,
      );
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
