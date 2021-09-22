import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { EventsGame } from './events.game';
import { GameService } from './game.service';

@Module({
  controllers: [GameController],
  providers: [EventsGame, GameService],
  exports: [GameService],
})
export class GameModule {}
