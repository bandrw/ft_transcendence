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
import { ChatService } from 'chat/chat.service';
import { GameService } from 'game/game.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'users/users.service';

@WebSocketGateway({ cors: true })
export class Events
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@Inject(GameService)
		private gameService: GameService,
		@Inject(UsersService)
		private userService: UsersService,
		@Inject(ChatService)
		private chatService: ChatService,
	) {
	}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('AppGateway');

	@SubscribeMessage('start')
	launchBall(@MessageBody() data: string) {
		const startData: { login: string, id: string } = JSON.parse(data);
		const game = this.gameService.games.find(g => g.id === startData.id);
		if (!game)
			return;

		if (!game.gameInterval) // чтобы не запускалось 2 интервала, т.к. start отсылают два клиента
			game.gameInterval = setInterval(() => {
				game.updatePositions();

				// Score check
				if (game.score.leftPlayer >= 11 || game.score.rightPlayer >= 11) {
					const data = {
						winner: game.leftPlayer.user.login
					};
					game.sendMsg('gameResults', JSON.stringify(data));
					const winnerLogin = game.score.leftPlayer >= 11 ? game.leftPlayer.user.login : game.rightPlayer.user.login;
					const loserLogin = game.score.rightPlayer >= 11 ? game.leftPlayer.user.login : game.rightPlayer.user.login;
					this.gameService.updateStatistics(winnerLogin, loserLogin, game.score)
						.then()
						.catch(() => console.log('[updateStatistics] error'));
					clearInterval(game.gameInterval);
					// this.gameService.games = this.gameService.games.splice(startData.id, 1);
					// console.log(this.gameService.games); // todo [remove finished game from this.gameService.games]
					return;
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
		const event: { login: string, gameId: string, key: string } = JSON.parse(data);
		const game = this.gameService.games.find(g => g.id === event.gameId);
		if (!game)
			return;

		if (game.leftPlayer.user.login === event.login) {
			if (event.key === 'ArrowUp')
				game.leftPlayer.controls.arrowUp = true;
			if (event.key === 'ArrowDown')
				game.leftPlayer.controls.arrowDown = true;
		}
		if (game.rightPlayer.user.login === event.login) {
			if (event.key === 'ArrowUp')
				game.rightPlayer.controls.arrowUp = true;
			if (event.key === 'ArrowDown')
				game.rightPlayer.controls.arrowDown = true;
		}
	}

	@SubscribeMessage('keyUp')
	keyUpHandler(@MessageBody() data: string) {
		const event: { login: string, gameId: string, key: string } = JSON.parse(data);
		const game = this.gameService.games.find(g => g.id === event.gameId);
		if (!game)
			return;

		if (game.leftPlayer.user.login === event.login) {
			if (event.key === 'ArrowUp')
				game.leftPlayer.controls.arrowUp = false;
			if (event.key === 'ArrowDown')
				game.leftPlayer.controls.arrowDown = false;
		}
		if (game.rightPlayer.user.login === event.login) {
			if (event.key === 'ArrowUp')
				game.rightPlayer.controls.arrowUp = false;
			if (event.key === 'ArrowDown')
				game.rightPlayer.controls.arrowDown = false;
		}
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
