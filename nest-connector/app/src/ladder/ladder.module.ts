import { Module } from '@nestjs/common';
import { LadderController } from './ladder.controller';
import { UsersModule } from '../users/users.module';
import { LadderService } from './ladder.service';
import { GameModule } from '../game/game.module';

@Module({
  controllers: [LadderController],
  imports: [UsersModule, GameModule],
  providers: [LadderService],
  exports: [LadderService],
})
export class LadderModule {}
