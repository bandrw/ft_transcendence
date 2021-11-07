import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { ChatService } from "chat/chat.service";

import { ChatEntity } from "./chat.entity";

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
	async getChats(@Query('userId') userId: number): Promise<ChatEntity[]> {
		if (!userId)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);

		return await this.chatService.getChats(userId);
	}

}
