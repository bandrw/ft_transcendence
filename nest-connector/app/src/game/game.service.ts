import { Injectable, Inject } from '@nestjs/common';
import { Game as G } from './game';
import { UsersService } from '../users/users.service';

@Injectable()
export class GameService {
  public gamers: G[] = [];
  @Inject(UsersService)
  userService: UsersService;
  startGame(Game: G) {
    this.gamers.push(Game);
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
  async updateStatistics(loginWin, loginLose) {
    const user = await this.userService.usersRepository.findOne({
      where: { login: loginWin },
    });
    user.games += 1;
    user.wins += 1;
    await this.userService.usersRepository.manager.save(user);
    const enemy = await this.userService.usersRepository.findOne({
      where: { login: loginLose },
    });
    enemy.games += 1;
    await this.userService.usersRepository.manager.save(enemy);
    this.userService.userStatsEvent({
      winner: user.login,
      looser: enemy.login,
    });
  }
}
