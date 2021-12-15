import { OnlineUser } from 'users/users.interface';

export interface Ladder {
	first: OnlineUser | null;
	second: OnlineUser | null;
}

export interface Duel {
	chatId: number;
	first: OnlineUser | null;
	second: OnlineUser | null;
}
