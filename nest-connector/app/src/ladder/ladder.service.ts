import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Ladder } from './ladder.interface';
import { OnlineUser } from '../users/users.interface';
import { Game } from '../game/game';
import { Gamer } from '../game/gamer.interface';
import { GameService } from '../game/game.service';

@Injectable()
export class LadderService {
  public lobby: Ladder[] = [];
  public lobbyId = 0;
  constructor(
    @Inject(UsersService)
    private users: UsersService,
    @Inject(GameService)
    private games: GameService,
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

  logout(login: string, i = -1) {
    if (i !== -1) {
      if (this.users.onlineUsers[i].status !== 'green') {
        this.updateStatus(this.users.onlineUsers[i].login, 'green');
      }
      this.users.clearUserData(i);
      return;
    }
    let index = 0;
    while (index < this.users.onlineUsers.length) {
      if (
        this.users.onlineUsers[index] &&
        this.users.onlineUsers[index].login === login
      ) {
        if (this.users.onlineUsers[index].status !== 'green') {
          this.updateStatus(this.users.onlineUsers[index].login, 'green');
        }
        this.users.clearUserData(index);
        return;
      }
      ++index;
    }
  }

  updateStatus(login: string, status: string) {
    let i = 0;
    while (this.users.onlineUsers[i].login != login) {
      ++i;
    }
    if (status === 'blue') {
      this.users.onlineUsers[i].status = 'green';
    } else {
      this.users.onlineUsers[i].status = status;
    }
    this.users.userEvent('updateUserStatus', {
      login: this.users.onlineUsers[i].login,
      status: this.users.onlineUsers[i].status,
    });
    if (status === 'yellow') {
      this.addToLadder(this.users.onlineUsers[i]);
    } else if (status === 'green') {
      this.removeFromLadder(
        this.users.onlineUsers[i],
        this.sendSingleEvents.bind(this),
      );
    } else if (status === 'blue') {
      this.removeFromLadder(
        this.users.onlineUsers[i],
        this.awayFromKeyboard.bind(this),
      );
    } else if (status === 'red') {
      this.gameStart(i, login);
    }
  }

  gameStart(userIndex, login) {
    this.users.userPersonalEvent(
      'enemyIsReady',
      this.users.onlineUsers[userIndex],
      login,
    );
    let k = 0;
    while (k < this.lobby.length) {
      if (
        this.lobby[k].first &&
        this.lobby[k].second &&
        (this.lobby[k].first.login === login ||
          this.lobby[k].second.login === login) &&
        this.lobby[k].first.status === 'red' &&
        this.lobby[k].second.status === 'red'
      ) {
        this.users.userPersonalEvent(
          'gameIsReady',
          null,
          this.lobby[k].first.login,
        );
        this.users.userPersonalEvent(
          'gameIsReady',
          null,
          this.lobby[k].second.login,
        );
        this.games.startGame(
          this.buildGame(this.lobby[k].first, this.lobby[k].second),
        );
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
    };
    const gamer2: Gamer = {
      user: second,
      gamePoints: 0,
      platformWide: 10,
      platformSpeed: 1,
      position: 50,
    };
    ++this.lobbyId;
    return new Game(gamer1, gamer2, this.games.games.length);
  }

  awayFromKeyboard(userIndex) {
    this.lobby[userIndex].first.status = 'yellow';
    this.users.userEvent('updateUserStatus', {
      login: this.lobby[userIndex].first.login,
      status: this.lobby[userIndex].first.status,
    });
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
    this.users.userEvent('updateUserStatus', {
      login: this.lobby[i].first.login,
      status: this.lobby[i].first.status,
    });
    this.users.userEvent('updateUserStatus', {
      login: this.lobby[i].second.login,
      status: this.lobby[i].second.status,
    });
    this.users.userPersonalEvent(
      'enemy',
      this.lobby[i].first,
      this.lobby[i].second.login,
    );
    this.users.userPersonalEvent(
      'enemy',
      this.lobby[i].second,
      this.lobby[i].first.login,
    );
  }

  removeFromLadder(user: OnlineUser, func) {
    let i = 0;
    while (i < this.lobby.length) {
      if (this.lobby[i].first && this.lobby[i].first.login === user.login) {
        this.lobby[i].first = null;
        if (this.lobby[i].second) {
          this.lobby[i].first = this.lobby[i].second;
          this.lobby[i].second = null;
          func(i);
        } else {
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
          func(i);
        } else {
          this.lobby = this.lobby.filter(function (val) {
            return val.first !== null || val.second !== null;
          });
        }
        break;
      }
      ++i;
    }
  }

  sendSingleEvents(userIndex: number) {
    this.lobby[userIndex].first.status = 'yellow';
    this.users.userEvent('updateUserStatus', {
      login: this.lobby[userIndex].first.login,
      status: this.lobby[userIndex].first.status,
    });
    this.users.userPersonalEvent(
      'enemy',
      null,
      this.lobby[userIndex].first.login,
    );
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
