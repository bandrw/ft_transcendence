import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [HistoryService],
  imports: [UsersModule],
  exports: [HistoryService],
})
export class HistoryModule {}
