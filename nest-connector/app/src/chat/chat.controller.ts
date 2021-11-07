import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ChatEntity } from "chat/chat.entity";
import { ChatService } from "chat/chat.service";

@Controller('chat')
export class ChatController {
	@Inject()
	private chatService: ChatService;

	@Post('create')
	async createChat(
		@Body('userOneId') userOneId: number,
		@Body('userTwoId') userTwoId: number
	) {
		if (!userOneId || !userTwoId)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);

		return await this.chatService.createChat(userOneId, userTwoId);
	}

	@Get()
	async getChats(
		@Query('userId') userId: number,
		@Query('expand') expand: string
	): Promise<ChatEntity[]> {
		if (!userId)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);

		return await this.chatService.getChats(userId, expand === 'true');
	}

}
