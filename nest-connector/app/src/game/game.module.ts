import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { Events } from '../events';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';
import { ChatService } from '../chat/chat.service';

@Module({
  controllers: [GameController],
  providers: [Events, GameService, ChatService],
  exports: [GameService],
  imports: [UsersModule],
})
export class GameModule {}
