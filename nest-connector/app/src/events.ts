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
import { GameService } from './game/game.service';
import { UsersService } from './users/users.service';
import { ChatService } from './chat/chat.service';

@WebSocketGateway({ cors: true })
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
    const game = this.gameService.gamers[u.id];
    if (game.playerTwo.user.login === u.login) {
      game.playerOne.user.resp.write(`event: ballLaunch\ndata: \n\n`);
    } else {
      game.playerTwo.user.resp.write(`event: ballLaunch\ndata: \n\n`);
    }

    game.gameInterval = setInterval(() => {
      game.updatePositions();

      const resp1 = game.playerOne.user.resp;
      const resp2 = game.playerTwo.user.resp;
      resp1.write(
        `event: gameLoop\ndata: ${JSON.stringify(game.coordinates)}\n\n`,
      );
      resp2.write(
        `event: gameLoop\ndata: ${JSON.stringify(game.coordinates)}\n\n`,
      );
    }, 1000 / game.fps);
  }

  @SubscribeMessage('keyDown')
  keyDownHandler(@MessageBody() user: string) {
    const u = JSON.parse(user);
    const game = this.gameService.gamers[u.gameId];
    if (game.playerOne.user.login === u.login) {
      if (u.key === 'ArrowUp')
        game.playerOne.controls.arrowUp = true;
      if (u.key === 'ArrowDown')
        game.playerOne.controls.arrowDown = true;
    }
    if (game.playerTwo.user.login === u.login) {
      if (u.key === 'ArrowUp')
        game.playerTwo.controls.arrowUp = true;
      if (u.key === 'ArrowDown')
        game.playerTwo.controls.arrowDown = true;
    }
  }

  @SubscribeMessage('keyUp')
  keyUpHandler(@MessageBody() user: string) {
    const u = JSON.parse(user);
    const game = this.gameService.gamers[u.gameId];
    if (game.playerOne.user.login === u.login) {
      if (u.key === 'ArrowUp')
        game.playerOne.controls.arrowUp = false;
      if (u.key === 'ArrowDown')
        game.playerOne.controls.arrowDown = false;
    }
    if (game.playerTwo.user.login === u.login) {
      if (u.key === 'ArrowUp')
        game.playerTwo.controls.arrowUp = false;
      if (u.key === 'ArrowDown')
        game.playerTwo.controls.arrowDown = false;
    }
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

  @SubscribeMessage('newPersonalMessage')
  newPersonalMessage(@MessageBody() data: string) {
    const messageInfo = JSON.parse(data);
    this.chatService.transferPersonalMessage(
      messageInfo.id,
      messageInfo.to,
      messageInfo.message,
    );
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: string) {
    this.userService.broadcastEventData('getMessage', data);
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
