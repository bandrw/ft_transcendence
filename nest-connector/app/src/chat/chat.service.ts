import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "chat/chat.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
	@InjectRepository(ChatEntity)
	private chatRepository: Repository<ChatEntity>;

	async createChat(userOneId: number, userTwoId: number): Promise<ChatEntity> {
		if (userOneId === userTwoId)
			throw new HttpException('Cannot create chat', HttpStatus.BAD_REQUEST);

		// Check if chat already exists
		if (await this.chatRepository.findOne({ where: { userOneId: userOneId, userTwoId: userTwoId } }))
			throw new HttpException('Chat already exists', HttpStatus.BAD_REQUEST);
		if (await this.chatRepository.findOne({ where: { userOneId: userTwoId, userTwoId: userOneId } }))
			throw new HttpException('Chat already exists', HttpStatus.BAD_REQUEST);

		try {
			const chat = this.chatRepository.create();
			chat.userOneId = userOneId;
			chat.userTwoId = userTwoId;
			return await this.chatRepository.save(chat);
		} catch (e) {
			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
		}
	}

	async getChats(userId: number, expand: boolean): Promise<ChatEntity[]> {
		const chats: ChatEntity[] = [];
		let r1: ChatEntity[];
		let r2: ChatEntity[];

		if (expand) {
			r1 = await this.chatRepository.find({ where: { userOneId: userId }, relations: ['userOne', 'userTwo'] });
			r2 = await this.chatRepository.find({ where: { userTwoId: userId }, relations: ['userOne', 'userTwo'] });
		} else {
			r1 = await this.chatRepository.find({ where: { userOneId: userId } });
			r2 = await this.chatRepository.find({ where: { userTwoId: userId } });
		}

		for (let i = 0; i < r1.length; ++i)
			chats.push(r1[i]);
		for (let i = 0; i < r2.length; ++i)
			chats.push(r2[i]);

		return chats;
	}
}
