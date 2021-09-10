import { Module } from '@nestjs/common';
import { LadderController } from './ladder.controller';
import { UsersModule } from '../users/users.module';
import { LadderService } from './ladder.service';

@Module({
  controllers: [LadderController],
  imports: [UsersModule],
  providers: [LadderService],
})
export class LadderModule {}
