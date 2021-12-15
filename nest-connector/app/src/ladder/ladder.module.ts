import { Module } from '@nestjs/common';
import { GameModule } from 'game/game.module';
import { LadderController } from 'ladder/ladder.controller';
import { LadderGateway } from 'ladder/ladder.gateway';
import { LadderService } from 'ladder/ladder.service';
import { UsersModule } from 'users/users.module';

@Module({
	controllers: [LadderController],
	imports: [UsersModule, GameModule],
	providers: [LadderService, LadderGateway],
	exports: [LadderService],
})
export class LadderModule {}
