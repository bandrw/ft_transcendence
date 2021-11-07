import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from 'chat/chat.controller';
import { ChatEntity } from "chat/chat.entity";
import { ChatService } from "chat/chat.service";

@Module({
	imports: [TypeOrmModule.forFeature([ChatEntity])],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService]
})
export class ChatModule {}
