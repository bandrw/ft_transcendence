import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { GameService } from './game/game.service';
import { UsersService } from './users/users.service';
import { ChatService } from './chat/chat.service';
import { LadderService } from './ladder/ladder.service';
import { OnlineUser } from './users/users.interface';
import { HistoryService } from './history/history.service';

@WebSocketGateway()
export class Events implements OnGatewayDisconnect {
  constructor(
    @Inject(GameService)
    private gameService: GameService,
    @Inject(UsersService)
    private userService: UsersService,
    @Inject(ChatService)
    private chatService: ChatService,
    @Inject(LadderService)
    private ladder: LadderService,
    @Inject(HistoryService)
    private historyService: HistoryService,
  ) {}
  @WebSocketServer() server: Server;
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
    let i = 0;
    while (i < this.userService.onlineUsers.length) {
      if (
        this.userService.onlineUsers[i] &&
        this.userService.onlineUsers[i].login === login
      ) {
        client.emit('userEntity', 'doubleLogin');
        return;
      }
      ++i;
    }
    const user: OnlineUser = await this.userService.usersRepository.findOne({
      where: { login: login },
    });
    if (user) {
      user.socketId = client.id;
      user.history = await this.historyService.GetHistory(user);
      this.userService.onlineUsers.push(user);
      client.emit('userEntity', { login: user.login, password: user.password });
    } else {
      client.emit('userEntity', null);
    }
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

  handleDisconnect(client: Socket): any {
    let i = 0;
    while (i < this.userService.onlineUsers.length) {
      if (
        this.userService.onlineUsers[i] &&
        this.userService.onlineUsers[i].socketId === client.id
      ) {
        this.ladder.logout(this.userService.onlineUsers[i].login, i);
        return;
      }
      ++i;
    }
  }
}
