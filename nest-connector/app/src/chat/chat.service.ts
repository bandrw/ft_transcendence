import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "chat/chat.entity";
import { Repository } from "typeorm";
import { UsersService } from "users/users.service";

@Injectable()
export class ChatService {
	@InjectRepository(ChatEntity)
	private chatRepository: Repository<ChatEntity>;
	@Inject()
	private usersService: UsersService;

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
			const r = await this.chatRepository.save(chat);

			const u1 = this.usersService.onlineUsers.find(usr => usr.id === r.userOneId);
			if (u1)
				u1.socket.emit('newChat', JSON.stringify(r));
			const u2 = this.usersService.onlineUsers.find(usr => usr.id === r.userTwoId);
			if (u2)
				u2.socket.emit('newChat', JSON.stringify(r));

			return r;
		} catch (e) {
			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
		}
	}

	async getChats(userId: number, expand: boolean): Promise<ChatEntity[]> {
		const chats: ChatEntity[] = [];
		let r1: ChatEntity[];
		let r2: ChatEntity[];

		if (expand) {
			r1 = await this.chatRepository.find({ where: { userOneId: userId }, relations: ['userOne', 'userTwo', 'messages'] });
			r2 = await this.chatRepository.find({ where: { userTwoId: userId }, relations: ['userOne', 'userTwo', 'messages'] });
		} else {
			r1 = await this.chatRepository.find({ where: { userOneId: userId } });
			r2 = await this.chatRepository.find({ where: { userTwoId: userId } });
		}

		for (let i = 0; i < r1.length; ++i)
			chats.push(r1[i]);
		for (let i = 0; i < r2.length; ++i)
			chats.push(r2[i]);

		if (expand)
			for (let i = 0; i < chats.length; ++i)
				chats[i].messages.sort((msg1, msg2) => msg1.date - msg2.date);

		return chats;
	}

	async getChat(id: number, expand = false): Promise<ChatEntity> {
		if (expand) {
			const r = await this.chatRepository.findOne({ where: { id: id }, relations: ['userOne', 'userTwo', 'messages'] });
			r.messages.sort((msg1, msg2) => msg1.date - msg2.date);
			return r;
		}
		return await this.chatRepository.findOne({ where: { id: id } });
	}
}
