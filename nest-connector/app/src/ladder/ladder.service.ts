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

  updateStatus(login: string, status: string) {
    console.log(`[updateStatus] ${login} to ${status}`);
    let i = 0;
    while (this.users.onlineUsers[i].login != login) {
      ++i;
    }
    if (status === 'blue') {
      this.users.onlineUsers[i].status = 'green';
    } else {
      this.users.onlineUsers[i].status = status;
    }
    this.users.userEvent('updateUser', this.users.onlineUsers[i]);
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
    console.log('lobby:');
    console.log(this.lobby);
  }

  gameStart(userIndex, login) {
    this.userPersonalEvent(
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
        this.userPersonalEvent('gameIsReady', null, this.lobby[k].first.login);
        this.userPersonalEvent('gameIsReady', null, this.lobby[k].second.login);
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
    return new Game(gamer1, gamer2, this.games.gamers.length);
  }

  awayFromKeyboard(userIndex) {
    this.lobby[userIndex].first.status = 'yellow';
    this.users.userEvent('updateUser', this.lobby[userIndex].first);
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
    this.users.userEvent('updateUser', this.lobby[i].first);
    this.users.userEvent('updateUser', this.lobby[i].second);
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
    console.log('[sendEvents] Events sent');
  }

  userPersonalEvent(event: string, user: OnlineUser, login: string) {
    let i = 0;
    while (i < this.users.onlineUsers.length) {
      if (this.users.onlineUsers[i].login === login) {
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
        this.users.onlineUsers[i].resp.write(
          `event: ${event}\ndata: ${data}\n\n`,
        );
        if (user)
          console.log(
            `[userPersonalEvent] Event ${event} sent to ${user.login}`,
          );
      }
      ++i;
    }
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
    this.users.userEvent('updateUser', this.lobby[userIndex].first);
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
