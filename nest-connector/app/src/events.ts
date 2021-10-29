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
  launchBall(@MessageBody() data: string) {
    const user = JSON.parse(data);
    const game = this.gameService.gamers[user.id];

    if (!game.gameInterval) // мини костыль, т.к. start отсылают два клиента и запускалось 2 интервала
      game.gameInterval = setInterval(() => {
        game.updatePositions();

        // Score check
        if (game.score.leftPlayer >= 11) {
          const data = {
            winner: game.playerOne.user.login
          };
          game.sendMsg('gameResults', JSON.stringify(data));
          this.gameService.updateStatistics(game.playerOne.user.login, game.playerTwo.user.login).then();
          clearInterval(game.gameInterval);
        } else if (game.score.rightPlayer >= 11) {
          const data = {
            winner: game.playerTwo.user.login
          };
          game.sendMsg('gameResults', JSON.stringify(data));
          this.gameService.updateStatistics(game.playerTwo.user.login, game.playerOne.user.login).then();
          clearInterval(game.gameInterval);
        }

        const gameLoopData = {
          b: game.coordinates.ball,
          lP: game.coordinates.leftPlayer,
          rP: game.coordinates.rightPlayer
        };
        game.sendMsg('gameLoop', JSON.stringify(gameLoopData));
      }, 1000 / game.fps);
  }

  @SubscribeMessage('keyDown')
  keyDownHandler(@MessageBody() data: string) {
    const user = JSON.parse(data);
    const game = this.gameService.gamers[user.gameId];
    if (game.playerOne.user.login === user.login) {
      if (user.key === 'ArrowUp')
        game.playerOne.controls.arrowUp = true;
      if (user.key === 'ArrowDown')
        game.playerOne.controls.arrowDown = true;
    }
    if (game.playerTwo.user.login === user.login) {
      if (user.key === 'ArrowUp')
        game.playerTwo.controls.arrowUp = true;
      if (user.key === 'ArrowDown')
        game.playerTwo.controls.arrowDown = true;
    }
  }

  @SubscribeMessage('keyUp')
  keyUpHandler(@MessageBody() data: string) {
    const user = JSON.parse(data);
    const game = this.gameService.gamers[user.gameId];
    if (game.playerOne.user.login === user.login) {
      if (user.key === 'ArrowUp')
        game.playerOne.controls.arrowUp = false;
      if (user.key === 'ArrowDown')
        game.playerOne.controls.arrowDown = false;
    }
    if (game.playerTwo.user.login === user.login) {
      if (user.key === 'ArrowUp')
        game.playerTwo.controls.arrowUp = false;
      if (user.key === 'ArrowDown')
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

  // @SubscribeMessage('gameScore')
  // async gameScore(@MessageBody() user: string) {
  //   const u = JSON.parse(user);
  //   await this.gameService.chooseUser(this.gameService.gamers[u.id], u.login);
  // }

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
