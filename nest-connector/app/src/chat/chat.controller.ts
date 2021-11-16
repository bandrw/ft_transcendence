import {
	Body,
	Controller,
	Get,
	Inject,
	Post,
	Query,
	Req,
	UseGuards,
	UsePipes, ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ExpandDTO } from "app.dto";
import { CreateChatDTO } from "chat/chat.dto";
import { ChatEntity } from "chat/chat.entity";
import { ChatService } from "chat/chat.service";
import { isDefined } from "class-validator";

@Controller('chat')
export class ChatController {
	@Inject()
	private chatService: ChatService;

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('create')
	async createChat(@Req() req, @Body() body: CreateChatDTO) {
		const user = req.user;
		const { userTwoId } = body;

		return await this.chatService.createChat(user.id, userTwoId);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getChats(@Req() req, @Query() query: ExpandDTO): Promise<ChatEntity[]> {
		const user = req.user;
		const { expand } = query;

		return await this.chatService.getChats(user.id, isDefined(expand));
	}

}
