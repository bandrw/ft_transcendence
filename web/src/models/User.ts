export class User {

	constructor() {
		this.id = -1;
		this.username = '';
		this.urlAvatar = '';
		this.loginDate = 0;
	}

	isAuthorized() {
		return this.username !== '';
	}

	id: number;
	username: string;
	loginDate: number;
	urlAvatar: string;

}
