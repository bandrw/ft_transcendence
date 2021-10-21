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
import { UsersService } from '../users/users.service';

@WebSocketGateway()
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
    console.log(this.gameService.gamers);
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
    if (this.gameService.gamers[u.id].playerTwo.user.login === u.login) {
      this.gameService.gamers[u.id].playerOne.position = u.enemyPlatformX;
      this.gameService.gamers[u.id].playerOne.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    } else {
      this.gameService.gamers[u.id].playerTwo.position = u.enemyPlatformX;
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
