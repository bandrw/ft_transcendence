export interface IUser {
	id: number;
	username: string;
	loginDate: number;
	urlAvatar: string;
	intraLogin: string | null;
	isAuthorized: boolean;
}

export class User implements IUser {
	constructor() {
		this.id = -1;
		this.username = '';
		this.urlAvatar = '';
		this.loginDate = 0;
		this.intraLogin = null;
		this.isAuthorized = false;
	}

	id: number;
	username: string;
	loginDate: number;
	urlAvatar: string;
	intraLogin: string | null;
	isAuthorized: boolean;
}
