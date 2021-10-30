import { Response } from 'express';

export interface OnlineUser {
	login: string;
	url_avatar: string;
	resp: Response;
	status: string;
}
