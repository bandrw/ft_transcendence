import { Inject, Injectable } from '@nestjs/common';
import { Game as G } from './game';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GameHistory } from '../history/history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  public games: G[] = [];
  @Inject(UsersService)
  userService: UsersService;
  constructor(
    @InjectRepository(GameHistory)
    public GameHistory: Repository<GameHistory>,
  ) {}
  startGame(Game: G) {
    this.games.push(Game);
  }
  async leaveGame(game: G, login: string, id) {
    if (game.playerOne.user.login === login) {
      await this.updateStatistics(
        game.playerTwo.user.login,
        game.playerOne.user.login,
        game,
      );
      this.userService.userPersonalEvent(
        'enemyHasLeaveGame',
        null,
        game.playerTwo.user.login,
      );
    } else {
      await this.updateStatistics(
        game.playerOne.user.login,
        game.playerTwo.user.login,
        game,
      );
      this.userService.userPersonalEvent(
        'enemyHasLeaveGame',
        null,
        game.playerOne.user.login,
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
          game,
        );
      }
    } else {
      game.playerOne.gamePoints += 1;
      if (game.playerOne.gamePoints == game.pointsForWin) {
        await this.updateStatistics(
          game.playerOne.user.login,
          game.playerTwo.user.login,
          game,
        );
      }
    }
  }
  setUsersToGame(new_game, winner, looser) {
    const game = {
      user_one: winner,
      user_two: looser,
      score_one: Number,
      score_two: Number,
      winner_id: Number,
      data: Date,
    };
    game.user_one = winner;
    game.user_two = looser;
    game.score_one = new_game.score_one;
    game.score_two = new_game.score_two;
    game.winner_id = new_game.winner_id;
    game.data = new_game.data;
    return game;
  }
  async createHistory(winner, looser, game) {
    const new_game = this.GameHistory.create();
    new_game.userOne = winner;
    new_game.userTwo = looser;
    new_game.winner_id = winner.id;
    if (game.playerOne.gamePoints) {
      new_game.score_one = game.playerOne.gamePoints;
    } else if (game.playerTwo.gamePoints) {
      new_game.score_two = game.playerTwo.gamePoints;
    }
    await this.GameHistory.manager.save(new_game);
    const new_game_with_users = this.setUsersToGame(new_game, winner, looser);
    this.updateGameHistory('addHistory', new_game_with_users);
  }
  updateGameHistory(eventName, data) {
    let i = 0;
    while (i < this.userService.onlineUsers.length) {
      if (
        data.user_one.login === this.userService.onlineUsers[i].login ||
        data.user_two.login === this.userService.onlineUsers[i].login
      ) {
        this.userService.onlineUsers[i].resp.write(
          'event: ' + eventName + '\ndata: ' + JSON.stringify(data) + '\n\n',
        );
      }
      ++i;
    }
  }
  async updateStatistics(loginWin, loginLose, game) {
    const winner = await this.userService.usersRepository.findOne({
      where: { login: loginWin },
    });
    winner.games += 1;
    winner.wins += 1;
    await this.userService.usersRepository.manager.save(winner);
    winner.password = null;
    const looser = await this.userService.usersRepository.findOne({
      where: { login: loginLose },
    });
    looser.games += 1;
    await this.userService.usersRepository.manager.save(looser);
    looser.password = null;
    this.userService.userStatsEvent({
      winner: winner.login,
      looser: looser.login,
    });
    await this.createHistory(winner, looser, game);
  }
}
