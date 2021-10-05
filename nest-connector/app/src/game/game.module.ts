import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { Events } from '../events';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [GameController],
  providers: [Events, GameService],
  exports: [GameService],
  imports: [UsersModule],
})
export class GameModule {}
