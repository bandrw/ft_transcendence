import { Injectable, Inject } from '@nestjs/common';
import { Game as G } from './game';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from './game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  private id: number;
  public games: G[] = [];
  @Inject(UsersService)
  userService: UsersService;
  constructor(
    @InjectRepository(GameHistory)
    public GameHistory: Repository<GameHistory>,
  ) {
    this.id = 0;
  }
  startGame(Game: G) {
    this.games.push(Game);
  }
  async leaveGame(game: G, login: string, id) {
    if (game.playerTwo.user.login === login) {
      await this.updateStatistics(
        game.playerTwo.user.login,
        game.playerOne.user.login,
      );
    } else {
      await this.updateStatistics(
        game.playerOne.user.login,
        game.playerTwo.user.login,
      );
    }
    this.games[id] = null;
  }
  async addScore(game: G, login: string) {
    if (game.playerTwo.user.login === login) {
      game.playerTwo.gamePoints += 1;
      if (game.playerTwo.gamePoints == game.pointsForWin) {
        await this.updateStatistics(
          game.playerTwo.user.login,
          game.playerOne.user.login,
        );
      }
    } else {
      game.playerOne.gamePoints += 1;
      if (game.playerOne.gamePoints == game.pointsForWin) {
        await this.updateStatistics(
          game.playerOne.user.login,
          game.playerTwo.user.login,
        );
      }
    }
  }
  async createHistory(winner, looser) {
    const new_game = this.GameHistory.create();
    new_game.id = ++this.id;
    new_game.user_one_id = winner;
    new_game.user_two_id = looser;
    new_game.winner_id = winner.id;
    await this.GameHistory.manager.save(new_game);
  }
  async updateStatistics(loginWin, loginLose) {
    const winner = await this.userService.usersRepository.findOne({
      where: { login: loginWin },
    });
    winner.games += 1;
    winner.wins += 1;
    await this.userService.usersRepository.manager.save(winner);
    const looser = await this.userService.usersRepository.findOne({
      where: { login: loginLose },
    });
    looser.games += 1;
    await this.userService.usersRepository.manager.save(looser);
    this.userService.userStatsEvent({
      winner: winner.login,
      looser: looser.login,
    });
    await this.createHistory(winner, looser);
  }
}
