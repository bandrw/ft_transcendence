import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User_table } from './user.entity';
import { Response } from 'express';
import { AvatarGenerator } from 'random-avatar-generator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User_table)
    private usersRepository: Repository<User_table>,
  ) {}
  async findAll(@Res() response: Response) {
    response.send(await this.usersRepository.find());
  }

  async findOne(login: string): Promise<User_table> {
    return await this.usersRepository.findOne({ where: { login: login } });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async create(login: string, password: string) {
    const user = this.usersRepository.create();
    user.password = password;
    user.login = login;
    user.salt = Math.random().toString();
    const generator = new AvatarGenerator();
    user.url_avatar = generator.generateRandomAvatar(user.salt);
    await this.usersRepository.manager.save(user);
  }
  // async update(field: string, new_val: any, login: string) {
  //   await this.usersRepository.manager.update(this.findOne();
  // }
}
