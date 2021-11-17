import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "message/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
	@InjectRepository(MessageEntity)
	private messageRepository: Repository<MessageEntity>;

	async createChatMessage(text: string, chatId: number, fromUserId: number): Promise<MessageEntity> {
		const message = this.messageRepository.create();
		message.chatId = chatId;
		message.fromUserId = fromUserId;
		message.text = text;
		return await this.messageRepository.save(message);
	}

	async createChannelMessage(text: string, channelId: number, fromUserId: number): Promise<MessageEntity> {
		const message = this.messageRepository.create();
		message.channelId = channelId;
		message.fromUserId = fromUserId;
		message.text = text;
		return await this.messageRepository.save(message);
	}

}
