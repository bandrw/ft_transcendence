import { Inject, Injectable } from '@nestjs/common';
import { Game } from 'game/game';
import { Gamer } from 'game/game.interface';
import { GameService } from 'game/game.service';
import { Ladder } from 'ladder/ladder.interface';
import { OnlineUser } from 'users/users.interface';
import { UsersService } from 'users/users.service';

@Injectable()
export class LadderService {
  public lobby: Ladder[] = [];
  public lobbyId = 0;
  constructor(
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(GameService)
    private gameService: GameService,
  ) {}

  traceLadder(login: string) {
    let i = 0;
    while (i < this.lobby.length) {
      if (
        (this.lobby[i].first && this.lobby[i].first.login === login) ||
        (this.lobby[i].second && this.lobby[i].second.login === login)
      ) {
        break;
      }
      ++i;
    }
    if (i !== this.lobby.length) {
      this.findAnotherLobby(i);
    }
  }

  updateStatus(login: string, status: string) {
    let i = 0;
    while (this.usersService.onlineUsers[i].login != login) {
      ++i;
    }
    if (status === 'blue') {
      this.usersService.onlineUsers[i].status = 'green';
    } else {
      this.usersService.onlineUsers[i].status = status;
    }
    this.usersService.userEvent('updateUser', this.usersService.onlineUsers[i]);
    if (status === 'yellow') {
      this.addToLadder(this.usersService.onlineUsers[i]);
    } else if (status === 'green') {
      this.removeFromLadder(
        this.usersService.onlineUsers[i],
        this.sendSingleEvents.bind(this),
      );
    } else if (status === 'blue') {
      this.removeFromLadder(
        this.usersService.onlineUsers[i],
        this.awayFromKeyboard.bind(this),
      );
    } else if (status === 'red') {
      this.gameStart(i, login);
    }
  }

  gameStart(userIndex, login) {
    this.userPersonalEvent('enemyIsReady', this.usersService.onlineUsers[userIndex], login);
    let k = 0;
    while (k < this.lobby.length) {
      if (this.lobby[k].first && this.lobby[k].second &&
        (this.lobby[k].first.login === login || this.lobby[k].second.login === login) &&
        this.lobby[k].first.status === 'red' && this.lobby[k].second.status === 'red'
      ) {
        this.updateStatus(this.lobby[k].first.login, 'inGame');
        this.updateStatus(this.lobby[k].second.login, 'inGame');
        this.userPersonalEvent('gameIsReady', null, this.lobby[k].first.login);
        this.userPersonalEvent('gameIsReady', null, this.lobby[k].second.login);
        this.gameService.startGame(this.buildGame(this.lobby[k].first, this.lobby[k].second));
      }
      ++k;
    }
  }

  buildGame(first: OnlineUser, second: OnlineUser): Game {
    const gamer1: Gamer = {
      user: first,
      gamePoints: 0,
      platformWide: 10,
      platformSpeed: 1,
      position: 50,
      controls: {
        arrowUp: false,
        arrowDown: false,
      },
    };
    const gamer2: Gamer = {
      user: second,
      gamePoints: 0,
      platformWide: 10,
      platformSpeed: 1,
      position: 50,
      controls: {
        arrowUp: false,
        arrowDown: false,
      },
    };
    ++this.lobbyId;
    return new Game(gamer1, gamer2);
  }

  awayFromKeyboard(userIndex) {
    this.lobby[userIndex].first.status = 'yellow';
    this.usersService.userEvent('updateUser', this.lobby[userIndex].first);
  }

  addToLadder(user: OnlineUser) {
    let i = 0;
    let userInLadder = false;
    while (!userInLadder) {
      if (!this.lobby[i] || !this.lobby[i].first) {
        this.lobby[i] = { first: user, second: null };
        userInLadder = true;
      } else if (!this.lobby[i].second) {
        this.lobby[i].second = user;
        userInLadder = true;
        this.sendEvents(i);
      }
      ++i;
    }
  }

  sendEvents(i: number) {
    this.lobby[i].first.status = 'orange';
    this.lobby[i].second.status = 'orange';
    this.usersService.userEvent('updateUser', this.lobby[i].first);
    this.usersService.userEvent('updateUser', this.lobby[i].second);
    this.userPersonalEvent(
      'enemy',
      this.lobby[i].first,
      this.lobby[i].second.login,
    );
    this.userPersonalEvent(
      'enemy',
      this.lobby[i].second,
      this.lobby[i].first.login,
    );
  }

  userPersonalEvent(event: string, user: OnlineUser, login: string) {
    let i = 0;
    while (i < this.usersService.onlineUsers.length) {
      if (this.usersService.onlineUsers[i].login === login) {
        let data;
        if (user) {
          data = JSON.stringify({
            login: user.login,
            url_avatar: user.url_avatar,
            status: user.status,
          });
        } else {
          data = false;
        }
        this.usersService.onlineUsers[i].resp.write(
          `event: ${event}\ndata: ${data}\n\n`,
        );
      }
      ++i;
    }
  }

  // private gameStop() {
  //   console.log('[gameStop]');
  //   for (let j = 0; j < this.lobby.length; ++j) {
  //     for (let k = 0; k < this.gameService.games.length; ++k) {
  //       const game = this.gameService.games[k];
  //       if (game.leftPlayer.user.login === this.lobby[j].first?.login || game.leftPlayer.user.login === this.lobby[j].second?.login ||
  //           game.rightPlayer.user.login === this.lobby[j].first?.login || game.rightPlayer.user.login === this.lobby[j].second?.login) {
  //         clearInterval(game.gameInterval);
  //       }
  //     }
  //   }
  // }

  removeFromLadder(user: OnlineUser, func) {
    let i = 0;
    while (i < this.lobby.length) {
      if (this.lobby[i].first && this.lobby[i].first.login === user.login) {
        this.lobby[i].first = null;
        if (this.lobby[i].second) {
          this.lobby[i].first = this.lobby[i].second;
          this.lobby[i].second = null;
          func(i);
          // this.gameStop();
        } else {
          // this.gameStop();
          this.lobby = this.lobby.filter(function (val) {
            return val.first !== null || val.second !== null;
          });
        }
        break;
      } else if (
        this.lobby[i].second &&
        this.lobby[i].second.login === user.login
      ) {
        this.lobby[i].second = null;
        if (this.lobby[i].first) {
          // this.gameStop();
          func(i);
        } else {
          // this.gameStop();
          this.lobby = this.lobby.filter(function (val) {
            return val.first !== null || val.second !== null;
          });
        }
        // Game Stop
        for (let j = 0; j < this.lobby.length; ++j) {
          for (let k = 0; k < this.gameService.games.length; ++k) {
            const game = this.gameService.games[k];
            if (game.leftPlayer.user.login === this.lobby[j].first?.login || game.rightPlayer.user.login === this.lobby[j].second?.login)
              clearInterval(game.gameInterval);
          }
        }
        break;
      }
      ++i;
    }
  }

  sendSingleEvents(userIndex: number) {
    this.lobby[userIndex].first.status = 'yellow';
    this.usersService.userEvent('updateUser', this.lobby[userIndex].first);
    this.userPersonalEvent('enemy', null, this.lobby[userIndex].first.login);
  }

  findAnotherLobby(userIndex: number): boolean {
    let k = 0;
    while (k < this.lobby.length) {
      if (k != userIndex) {
        if (this.lobby[k].first && !this.lobby[k].second) {
          this.lobby[k].second = this.lobby[userIndex].first;
          this.lobby[userIndex].first = null;
          this.sendEvents(k);
          return true;
        } else if (!this.lobby[k].first && this.lobby[k].second) {
          this.lobby[k].first = this.lobby[userIndex].first;
          this.lobby[userIndex].first = null;
          this.sendEvents(k);
          return true;
        }
      }
      ++k;
    }
    return false;
  }
}
