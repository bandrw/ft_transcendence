import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { EventsGame } from './events.game';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [GameController],
  providers: [EventsGame, GameService],
  exports: [GameService],
  imports: [UsersModule],
})
export class GameModule {}
