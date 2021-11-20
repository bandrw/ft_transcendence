import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameController } from 'game/game.controller';
import { GameEntity } from "game/game.entity";
import { GameGateway } from 'game/game.gateway';
import { GameService } from 'game/game.service';
import { UsersModule } from 'users/users.module';

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([GameEntity])],
	providers: [GameService, GameGateway],
	controllers: [GameController],
	exports: [GameService],
})
export class GameModule {}
