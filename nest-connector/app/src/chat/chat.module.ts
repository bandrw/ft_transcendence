import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from 'chat/chat.controller';
import { ChatEntity } from "chat/chat.entity";
import { ChatService } from "chat/chat.service";
import { UsersModule } from "users/users.module";

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([ChatEntity])],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService]
})
export class ChatModule {}
