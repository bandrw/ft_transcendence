import { GameHistory } from './history.entity';
import { OnlineUser } from '../users/users.interface';

export interface HistoryInterface extends GameHistory {
  user_one?: OnlineUser;
  user_two?: OnlineUser;
}
