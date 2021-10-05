export default class User {
	constructor() {
		this.username = ''
		this.loginDate = 0
	}

	isAuthorized(): boolean {
		return this.username !== ''
	}

	username: string
	loginDate: number
}
