import { Inject, Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UsersService } from '../users/users.service';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class EventsGame
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(GameService)
    private gameService: GameService,
    @Inject(UsersService)
    private userService: UsersService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('start')
  launchBall(@MessageBody() user: string) {
    console.log('events.game start', user);
    console.log(this.gameService.games);
    // console.log('[launchBall]', user);
    // const u = JSON.parse(user);
    // if (this.gameService.gamers[u.id].playerTwo.user.login === u.login) {
    //   this.gameService.gamers[u.id].playerOne.user.resp.write(
    //     `event: ballLaunch\ndata: \n\n`,
    //   );
    // } else {
    //   this.gameService.gamers[u.id].playerTwo.user.resp.write(
    //     `event: ballLaunch\ndata: \n\n`,
    //   );
    // }
  }

  @SubscribeMessage('platformPosition')
  platformPosition(@MessageBody() user: string) {
    const u = JSON.parse(user);
    if (this.gameService.games[u.id].rightPlayer.user.login === u.login) {
      this.gameService.games[u.id].leftPlayer.position = u.enemyPlatformX;
      this.gameService.games[u.id].leftPlayer.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    } else {
      this.gameService.games[u.id].rightPlayer.position = u.enemyPlatformX;
      this.gameService.games[u.id].rightPlayer.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    }
  }

  // @SubscribeMessage('gameScore')
  // async gameScore(@MessageBody() user: string) {
  //   const u = JSON.parse(user);
  //   await this.gameService.chooseUser(this.gameService.gamers[u.id], u.login);
  // }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: string) {
    this.userService.broadcastEventData('getMessage', data);
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
