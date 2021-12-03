import { Module } from '@nestjs/common';
import { GameModule } from 'game/game.module';
import { LadderController } from 'ladder/ladder.controller';
import { LadderService } from 'ladder/ladder.service';
import { UsersModule } from 'users/users.module';
import { LadderGateway } from './ladder.gateway';

@Module({
  controllers: [LadderController],
  imports: [UsersModule, GameModule],
  providers: [LadderService, LadderGateway],
  exports: [LadderService],
})
export class LadderModule {}
