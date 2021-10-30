import { Injectable, Inject } from '@nestjs/common';
import { Game as G } from './game';
import { UsersService } from '../users/users.service';

@Injectable()
export class GameService {
  public games: G[] = [];
  @Inject(UsersService)
  userService: UsersService;
  startGame(Game: G) {
    this.games.push(Game);
  }
  async leaveGame(game: G, login: string, id) {
    this.games[id] = null;
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
  }
}
