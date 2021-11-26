import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OnlineUser } from '../users/users.interface';
import { HistoryInterface } from './history.interface';
import { getConnection } from 'typeorm';
import { GameHistory } from './history.entity';

@Injectable()
export class HistoryService {
  constructor(private usersService: UsersService) {}

  async GetHistory(user: OnlineUser): Promise<HistoryInterface> {
    const history = await getConnection()
      .createQueryBuilder()
      .select()
      .from(GameHistory, 'gameHistory')
      .where('user_one_id = :id', { id: user.id })
      .orWhere('user_two_id = :id', { id: user.id })
      .orderBy('data', 'DESC')
      .limit(100)
      .execute();
    let i = 0;
    let k;
    const users = await this.usersService.usersRepository.find({
      select: ['login', 'url_avatar', 'id'],
    });
    while (i < history.length) {
      k = 0;
      while (k < users.length) {
        if (history[i].user_one_id === users[k].id) {
          history[i].user_one = users[k];
        } else if (history[i].user_two_id === users[k].id) {
          history[i].user_two = users[k];
        }
        ++k;
      }
      ++i;
    }
    return history;
  }
}
