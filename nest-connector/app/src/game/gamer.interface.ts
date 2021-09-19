import { OnlineUser } from '../users/users.interface';

export interface Gamer {
  gamePoints: number;
  position: number;
  platformSpeed: number;
  platformWide: number;
  user: OnlineUser;
}
