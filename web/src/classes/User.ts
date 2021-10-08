export class User {

	constructor() {
		this.username = ''
		this.loginDate = 0
	}

	isAuthorized() {
		return this.username !== ''
	}

	username: string;
	loginDate: number;

}
