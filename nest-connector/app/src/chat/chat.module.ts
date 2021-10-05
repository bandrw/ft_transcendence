import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatService],
  imports: [UsersModule],
  controllers: [ChatController],
})
export class ChatModule {}
