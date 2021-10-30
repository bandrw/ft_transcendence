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

	public gamers: Game[] = [];

	@Inject(UsersService)
	userService: UsersService;

	startGame(Game: Game) {
		this.gamers.push(Game);
	}

	async pushGame(winner: User, loser: User, score: { leftPlayer: number, rightPlayer: number }): Promise<GameEntity> {
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

	// async chooseUser(game: G, login: string) {
	//   if (game.playerTwo.user.login === login) {
	//     game.playerTwo.gamePoints += 1;
	//     if (game.playerTwo.gamePoints == game.pointsForWin) {
	//       await this.updateStatistics(
	//         game.playerTwo.user.login,
	//         game.playerOne.user.login,
	//       );
	//     }
	//   } else {
	//     game.playerOne.gamePoints += 1;
	//     if (game.playerOne.gamePoints == game.pointsForWin) {
	//       await this.updateStatistics(
	//         game.playerOne.user.login,
	//         game.playerTwo.user.login,
	//       );
	//     }
	//   }
	// }

	async updateStatistics(winnerLogin: string, loserLogin: string, score: { leftPlayer: number, rightPlayer: number }) {
		const winner = await this.userService.findOne(winnerLogin);
		if (!winner)
			throw new HttpException('Cannot update statistics', HttpStatus.INTERNAL_SERVER_ERROR);
		const loser = await this.userService.findOne(loserLogin);
		if (!loser)
			throw new HttpException('Cannot update statistics', HttpStatus.INTERNAL_SERVER_ERROR);

		return await this.pushGame(winner, loser, score);
	}
}
