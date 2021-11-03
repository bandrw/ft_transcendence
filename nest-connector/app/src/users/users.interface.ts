import { Socket } from "socket.io";

export interface OnlineUser {
	id: number;
	login: string;
	url_avatar: string;
	socket: Socket
	status: string;
}
