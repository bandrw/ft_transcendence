export class User {

	constructor() {
		this.username = '';
		this.urlAvatar = '';
		this.loginDate = 0;
	}

	isAuthorized() {
		return this.username !== '';
	}

	username: string;
	loginDate: number;
	urlAvatar: string;

}
