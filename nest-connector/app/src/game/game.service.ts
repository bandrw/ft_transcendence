import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from 'game/game';
import { GameEntity } from "game/game.entity";
import { Repository } from "typeorm";
import { User } from "users/user.entity";
import { UsersService } from 'users/users.service';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		public gameRepository: Repository<GameEntity>
	) {}

	public games: Game[] = [];

	@Inject(UsersService)
	userService: UsersService;

	startGame(game: Game) {
		this.games.push(game);
	}

	async pushGameResult(winner: User, loser: User, score: { leftPlayer: number, rightPlayer: number }): Promise<GameEntity> {
		const game = this.gameRepository.create();
		game.winner = winner;
		game.loser = loser;
		game.leftScore = score.leftPlayer;
		game.rightScore = score.rightPlayer;
		return await this.gameRepository.manager.save(game);
	}

	async getGames(): Promise<GameEntity[]> {
		return await this.gameRepository.find({ relations: ['winner', 'loser'] });
	}

	addWatcher(watcherLogin: string, gamerLogin: string) {
		const watcher = this.userService.onlineUsers.find(usr => usr.login === watcherLogin);
		if (!watcher)
			return ;

		const game = this.games.find(g => g.leftPlayer.user.login === gamerLogin || g.rightPlayer.user.login === gamerLogin);
		if (game) {
			watcher.socket.emit('gameSettings', JSON.stringify(game.gameSettings));
			game.watchers.push(watcher);
		}
	}

	async updateStatistics(winnerLogin: string, loserLogin: string, score: { leftPlayer: number, rightPlayer: number }) {
		const winner = await this.userService.findOneByLogin(winnerLogin);
		if (!winner)
			throw new HttpException('Cannot update statistics', HttpStatus.INTERNAL_SERVER_ERROR);
		const loser = await this.userService.findOneByLogin(loserLogin);
		if (!loser)
			throw new HttpException('Cannot update statistics', HttpStatus.INTERNAL_SERVER_ERROR);

		return await this.pushGameResult(winner, loser, score);
	}
}
