import { Module } from '@nestjs/common';
import { GameModule } from 'game/game.module';
import { LadderController } from 'ladder/ladder.controller';
import { LadderService } from 'ladder/ladder.service';
import { UsersModule } from 'users/users.module';

@Module({
  controllers: [LadderController],
  imports: [UsersModule, GameModule],
  providers: [LadderService],
  exports: [LadderService],
})
export class LadderModule {}
