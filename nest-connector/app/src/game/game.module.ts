import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UsersModule } from '../users/users.module';
import { GameHistory } from '../history/history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
  imports: [UsersModule, TypeOrmModule.forFeature([GameHistory])],
})
export class GameModule {}
