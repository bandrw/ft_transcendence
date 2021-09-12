import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Ladder } from './ladder.interface';
import { OnlineUser } from '../users/users.interface';

@Injectable()
export class LadderService {
  private lobby: Ladder[] = [];
  constructor(
    @Inject(UsersService)
    private users: UsersService,
  ) {}
  updateStatus(login: string, status: string) {
    let i = 0;
    while (this.users.onlineUsers[i].login != login) {
      ++i;
    }
    this.users.onlineUsers[i].status = status;
    this.users.userEvent('status', this.users.onlineUsers[i]);
    if (status === 'yellow') {
      this.addToLadder(this.users.onlineUsers[i]);
    } else if (status === 'green') {
      this.removeFromLadder(this.users.onlineUsers[i]);
    }
    return login;
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
        this.lobby[i].first.status = 'orange';
        this.lobby[i].second.status = 'orange';
        this.users.userEvent('status', this.lobby[i].first);
        this.users.userEvent('status', this.lobby[i].second);
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
      ++i;
    }
    console.log(this.lobby);
  }
  async userPersonalEvent(event: string, user: OnlineUser, login: string) {
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
      }
      ++i;
    }
  }
  removeFromLadder(user: OnlineUser) {
    let i = 0;
    while (i < this.lobby.length) {
      if (this.lobby[i].first && this.lobby[i].first.login === user.login) {
        this.lobby[i].first = null;
        if (this.lobby[i].second && this.lobby[i].second.status === 'orange') {
          this.lobby[i].second.status = 'yellow';
          this.users.userEvent('status', this.lobby[i].second);
          this.userPersonalEvent(
            'enemy',
            this.lobby[i].first,
            this.lobby[i].second.login,
          );
          this.lobby[i].first = this.lobby[i].second;
          this.lobby[i].second = null;
        }
        break;
      } else if (
        this.lobby[i].second &&
        this.lobby[i].second.login === user.login
      ) {
        this.lobby[i].second = null;
        if (this.lobby[i].first && this.lobby[i].first.status === 'orange') {
          this.lobby[i].first.status = 'yellow';
          this.users.userEvent('status', this.lobby[i].first);
          this.userPersonalEvent('enemy', null, this.lobby[i].first.login);
        }
        break;
      }
      ++i;
    }
    console.log(this.lobby);
  }
}
