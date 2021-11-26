import { User } from './user.entity';

export interface OnlineUser extends User {
  resp?: any;
  status?: string;
  socketId?: string;
  history?: [];
}
