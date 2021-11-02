import { Response } from 'express';

export interface OnlineUser {
	id: number;
	login: string;
	url_avatar: string;
	resp: Response;
	status: string;
}
