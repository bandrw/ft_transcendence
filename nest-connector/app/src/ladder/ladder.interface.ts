import { OnlineUser } from 'users/users.interface';

export interface Ladder {
	first: OnlineUser | null;
	second: OnlineUser | null;
}
