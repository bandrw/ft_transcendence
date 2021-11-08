import { Inject } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChatService } from "chat/chat.service";
import { MessageService } from "message/message.service";
import { Socket } from "socket.io";
import { UsersGateway } from "users/users.gateway";
import { UsersService } from "users/users.service";

@WebSocketGateway()
export class MessageGateway {
	@Inject()
	usersService: UsersService;
	@Inject()
	messageService: MessageService;
	@Inject()
	chatService: ChatService;

	@SubscribeMessage('sendMessage')
	async sendMessageHandler(client: Socket, data: string): Promise<void> {
		const msgData: { text: string, chatId: number } = JSON.parse(data);
		const senderLogin = UsersGateway.users.get(client.id);
		const sender = await this.usersService.onlineUsers.find(usr => usr.login === senderLogin);

		const msg = await this.messageService.createMessage(msgData.text, msgData.chatId, sender.id);
		if (msg) {
			const chat = await this.chatService.getChat(msgData.chatId);

			const onlineUsrOne = this.usersService.onlineUsers.find(usr => usr.id === chat.userOneId);
			if (onlineUsrOne)
				onlineUsrOne.socket.emit('receiveMessage', JSON.stringify(msg));

			const onlineUsrTwo = this.usersService.onlineUsers.find(usr => usr.id === chat.userTwoId);
			if (onlineUsrTwo)
				onlineUsrTwo.socket.emit('receiveMessage', JSON.stringify(msg));
		}
	}

}
