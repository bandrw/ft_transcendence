import { Socket } from "socket.io";
import { User } from "users/entities/user.entity";

export interface OnlineUser {
	id: number;
	login: string;
	url_avatar: string;
	phoneNumber: string | null;
	socket: Socket
	status: string;
	subscriptions: User[];
	subscribers: User[];
}
