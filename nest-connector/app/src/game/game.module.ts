import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
  imports: [UsersModule],
})
// @ts-ignore
export class GameModule {}