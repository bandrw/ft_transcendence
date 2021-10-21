import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User_table } from './user.entity';
import { Response } from 'express';
import { AvatarGenerator } from 'random-avatar-generator';
import { OnlineUser } from './users.interface';

@Injectable()
export class UsersService {
  onlineUsers: OnlineUser[] = [];
  constructor(
    @InjectRepository(User_table)
    public usersRepository: Repository<User_table>,
  ) {}

  async findAll(@Res() response: Response) {
    response.send(
      await this.usersRepository.find({ select: ['login', 'url_avatar'] }),
    );
  }

  async login(@Res() res: Response, login: string): Promise<User_table> {
    return await this.usersRepository.findOne({
      where: { login: login },
    });
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
    const ret = generator.generateRandomAvatar(salt);
    user.url_avatar = ret;
    await this.usersRepository.manager.save(user);
    let i = 0;
    while (i < this.onlineUsers.length) {
      if (this.onlineUsers[i].login == user.login) {
        this.onlineUsers[i].url_avatar = ret;
        this.userEvent('updateUser', this.onlineUsers[i]);
      }
      ++i;
    }
    return ret;
  }
  userEvent(event: string, user: OnlineUser) {
    let i = 0;
    while (i < this.onlineUsers.length) {
      if (this.onlineUsers[i].login != user.login) {
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
        console.log(`[userEvent] Event ${event} sent to ${user.login}`);
      }
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
}
