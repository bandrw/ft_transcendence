import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelModule } from "channel/channel.module";
import { ChatModule } from "chat/chat.module";
import { MessageController } from 'message/message.controller';
import { MessageEntity } from "message/message.entity";
import { MessageGateway } from 'message/message.gateway';
import { MessageService } from 'message/message.service';
import { UsersModule } from "users/users.module";

@Module({
	imports: [UsersModule, ChatModule, ChannelModule, TypeOrmModule.forFeature([MessageEntity])],
	controllers: [MessageController],
	providers: [MessageService, MessageGateway]
})
export class MessageModule {}
