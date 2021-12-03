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
			const chat = await this.chatService.getChat(msgData.chatId);
			if (sender.id !== chat.userOneId && sender.id !== chat.userTwoId)
				return ;

			const msg = await this.messageService.createChatMessage(msgData.text, msgData.chatId, sender.id);
			if (msg) {
				const onlineUsrOne = this.usersService.onlineUsers.find(usr => usr.id === chat.userOneId);
				if (onlineUsrOne)
					onlineUsrOne.socket.emit('receiveMessage', JSON.stringify(msg));

				const onlineUsrTwo = this.usersService.onlineUsers.find(usr => usr.id === chat.userTwoId);
				if (onlineUsrTwo)
					onlineUsrTwo.socket.emit('receiveMessage', JSON.stringify(msg));
			}
		} else if (msgData.channelId) {
			const channel = await this.channelService.getChannel(msgData.channelId, true);
			if (!channel.members.find(member => member.id === sender.id))
				return ;

			const msg = await this.messageService.createChannelMessage(msgData.text, msgData.channelId, sender.id);
			if (msg) {
				if (channel.isPrivate) {
					for (const member of channel.members) {
						const onlineMember = this.usersService.onlineUsers.find(usr => member.id === usr.id);
						if (!onlineMember)
							continue ;
						onlineMember.socket.emit('receiveMessage', JSON.stringify(msg));
					}
				} else {
					this.usersService.broadcastEventData('receiveMessage', JSON.stringify(msg));
				}
			}
		}
	}

}
