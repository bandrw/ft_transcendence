import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Response } from 'express';
import { AvatarGenerator } from 'random-avatar-generator';
import { OnlineUser } from './users.interface';

@Injectable()
export class UsersService {
  onlineUsers: OnlineUser[] = [];
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async findAll(@Res() response: Response) {
    response.send(
      await this.usersRepository.find({
        select: ['login', 'url_avatar', 'id'],
      }),
    );
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ login: username });
  }

  logout(login: string, i = -1) {
    if (i !== -1) {
      this.userEvent('logout_SSE', this.onlineUsers[i]);
      this.onlineUsers[i].resp.end();
      this.onlineUsers[i] = null;
      this.onlineUsers = this.onlineUsers.filter((user) => user);
      return;
    }
    let index = 0;
    while (index < this.onlineUsers.length) {
      if (this.onlineUsers[index] && this.onlineUsers[index].login === login) {
        this.userEvent('logout_SSE', this.onlineUsers[index]);
        this.onlineUsers[index].resp.end();
        this.onlineUsers[index] = null;
        this.onlineUsers = this.onlineUsers.filter((user) => user);
        return;
      }
      ++index;
    }
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(login: string, password: string) {
    const user = this.usersRepository.create();
    user.password = password;
    user.login = login;
    const salt = Math.random().toString();
    const generator = new AvatarGenerator();
    user.url_avatar = generator.generateRandomAvatar(salt);
    await this.usersRepository.manager.save(user);
  }
  async updateAvatar(login: string) {
    const user = await this.usersRepository.findOne({
      where: { login: login },
    });
    const salt = Math.random().toString();
    const generator = new AvatarGenerator();
    user.url_avatar = generator.generateRandomAvatar(salt);
    await this.usersRepository.manager.save(user);
    let i = 0;
    while (i < this.onlineUsers.length) {
      if (this.onlineUsers[i].login == user.login) {
        this.onlineUsers[i].url_avatar = user.url_avatar;
        this.userEvent('updateUserURL_avatar', {
          login: this.onlineUsers[i].login,
          url_avatar: this.onlineUsers[i].url_avatar,
        });
        break;
      }
      ++i;
    }
    return user.url_avatar;
  }

  userEvent(event: string, user: any) {
    let i = 0;
    while (i < this.onlineUsers.length) {
      this.onlineUsers[i].resp.write(
        'event: ' +
          event +
          '\ndata: ' +
          JSON.stringify({
            login: user.login,
            url_avatar: user.url_avatar,
            status: user.status,
          }) +
          '\n\n',
      );
      ++i;
    }
  }
  userStatsEvent(stats) {
    let i = 0;
    while (i < this.onlineUsers.length) {
      this.onlineUsers[i].resp.write(
        'event: updateUsersStats\ndata: ' + JSON.stringify(stats) + '\n\n',
      );
      ++i;
    }
  }
  broadcastEventData(event, data) {
    let i = 0;
    while (i < this.onlineUsers.length) {
      this.onlineUsers[i].resp.write(
        `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
      );
      ++i;
    }
  }
  userPersonalEvent(event: string, user: OnlineUser, login: string) {
    let i;
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
    i = 0;
    while (i < this.onlineUsers.length) {
      if (this.onlineUsers[i].login === login) {
        this.onlineUsers[i].resp.write(`event: ${event}\ndata: ${data}\n\n`);
        return;
      }
      ++i;
    }
  }
}
