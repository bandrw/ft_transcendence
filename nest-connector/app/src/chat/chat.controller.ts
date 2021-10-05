import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  @Inject(ChatService)
  chatService: ChatService;
  @Get('create')
  create(@Query('from') from: string, @Query('to') to: string) {
    this.chatService.createNewPersonalChat(from, to);
  }
}
