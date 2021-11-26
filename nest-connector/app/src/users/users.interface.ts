import { User } from './user.entity';
import { HistoryInterface } from '../history/history.interface';

export interface OnlineUser extends User {
  resp?: any;
  status?: string;
  socketId?: string;
  history?: HistoryInterface;
}
