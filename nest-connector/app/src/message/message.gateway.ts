import { Inject } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ChannelService } from "channel/channel.service";
import { ChatService } from "chat/chat.service";
import { MessageService } from "message/message.service";
import { Socket } from "socket.io";
import { UsersService } from "users/users.service";

@WebSocketGateway({ cors: true })
export class MessageGateway {
	@Inject()
	usersService: UsersService;
	@Inject()
	messageService: MessageService;
	@Inject()
	chatService: ChatService;
	@Inject()
	channelService: ChannelService;

	@SubscribeMessage('sendMessage')
	async sendMessageHandler(client: Socket, data: string): Promise<void> {
		const msgData: { text: string, chatId?: number, channelId?: number } = JSON.parse(data);
		const senderLogin = this.usersService.usersSocketIds.get(client.id);
		const sender = await this.usersService.onlineUsers.find(usr => usr.login === senderLogin);

		if (!sender)
			return ;

		if (msgData.chatId) {
			const msg = await this.messageService.createChatMessage(msgData.text, msgData.chatId, sender.id);
			if (msg) {
				const chat = await this.chatService.getChat(msgData.chatId);

				const onlineUsrOne = this.usersService.onlineUsers.find(usr => usr.id === chat.userOneId);
				if (onlineUsrOne)
					onlineUsrOne.socket.emit('receiveMessage', JSON.stringify(msg));

				const onlineUsrTwo = this.usersService.onlineUsers.find(usr => usr.id === chat.userTwoId);
				if (onlineUsrTwo)
					onlineUsrTwo.socket.emit('receiveMessage', JSON.stringify(msg));
			}
		} else if (msgData.channelId) {
			const msg = await this.messageService.createChannelMessage(msgData.text, msgData.channelId, sender.id);
			if (msg) {
				const channel = await this.channelService.getChannel(msgData.channelId, true);

				for (let i = 0; i < channel.members.length; ++i) {
					const inOnline = this.usersService.onlineUsers.find(usr => usr.id === channel.members[i].id);
					if (inOnline)
						inOnline.socket.emit('receiveMessage', JSON.stringify(msg));
				}
			}
		}
	}

}
