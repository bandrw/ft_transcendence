import { Inject, Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from 'chat/chat.service';
import { GameService } from 'game/game.service';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'users/users.service';

@WebSocketGateway({ cors: true })
export class Events implements OnGatewayConnection, OnGatewayDisconnect {
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

	handleConnection(client: Socket, ...args: any[]): any {
		this.logger.log('client connected: ' + client.id + args);
	}

	handleDisconnect(client: Socket): any {
		this.logger.log(`Client disconnected : ${client.id}`);
	}
}
