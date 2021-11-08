import { Controller, Get, Inject } from '@nestjs/common';
import { MessageService } from "message/message.service";

@Controller('message')
export class MessageController {
	@Inject()
	messageService: MessageService;

	// @Get()
	// async getMessages() {
	// 	return await this.messageService.getAllMessages();
	// }

}
