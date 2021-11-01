import { WebSocketGateway } from '@nestjs/websockets';
import {
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { GameService } from './game/game.service';
import { UsersService } from './users/users.service';
import { ChatService } from './chat/chat.service';

@WebSocketGateway()
export class Events
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(GameService)
    private gameService: GameService,
    @Inject(UsersService)
    private userService: UsersService,
    @Inject(ChatService)
    private chatService: ChatService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  @SubscribeMessage('start')
  launchBall(@MessageBody() user: string) {
    const u = JSON.parse(user);
    if (this.gameService.games[u.id].playerTwo.user.login === u.login) {
      this.gameService.games[u.id].playerOne.user.resp.write(
        `event: ballLaunch\ndata: \n\n`,
      );
    } else {
      this.gameService.games[u.id].playerTwo.user.resp.write(
        `event: ballLaunch\ndata: \n\n`,
      );
    }
  }
  @SubscribeMessage('platformPosition')
  platformPosition(@MessageBody() user: string) {
    const u = JSON.parse(user);
    if (this.gameService.games[u.id].playerTwo.user.login === u.login) {
      this.gameService.games[u.id].playerOne.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    } else {
      this.gameService.games[u.id].playerTwo.user.resp.write(
        `event: enemyPosition\ndata: ${u.enemyPlatformX}\n\n`,
      );
    }
  }

  @SubscribeMessage('gameScore')
  async gameScore(@MessageBody() user: string) {
    const u = JSON.parse(user);
    await this.gameService.addScore(this.gameService.games[u.id], u.login);
  }
  @SubscribeMessage('login')
  async login(@ConnectedSocket() client: Socket, @MessageBody() login: string) {
    const user = await this.userService.usersRepository.findOne({
      where: { login: login },
    });
    let i = 0;
    while (i < this.userService.onlineUsers.length) {
      if (this.userService.onlineUsers[i].login === login) {
        client.emit('userEntity', 'doubleLogin');
        return;
      }
      ++i;
    }
    client.emit('userEntity', user);
  }
  @SubscribeMessage('leaveGame')
  async leaveGame(@MessageBody() data: any) {
    await this.gameService.leaveGame(
      this.gameService.games[data.id],
      data.login,
      data.id,
    );
  }
  @SubscribeMessage('newPersonalMessage')
  newPersonalMessage(@MessageBody() data: string) {
    const messageInfo = JSON.parse(data);
    this.chatService.transferPersonalMessage(
      messageInfo.id,
      messageInfo.to,
      messageInfo.message,
    );
  }
  afterInit(server: Server): any {
    this.logger.log(server);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log('client connected: ' + client.id + args);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected : ${client.id}`);
  }
}
