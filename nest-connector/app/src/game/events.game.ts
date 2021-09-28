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
  launchBall(@MessageBody() user: string) {
    const u = JSON.parse(user);
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
  @SubscribeMessage('platformPosition')
  platformPosition(@MessageBody() user: string) {
    const u = JSON.parse(user);
    if (this.gameService.gamers[u.id].playerTwo.user.login === u.login) {
      this.gameService.gamers[u.id].playerOne.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    } else {
      this.gameService.gamers[u.id].playerTwo.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    }
  }

  @SubscribeMessage('gameScore')
  async gameScore(@MessageBody() user: string) {
    const u = JSON.parse(user);
    await this.gameService.chooseUser(this.gameService.gamers[u.id], u.login);
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
