export default class User {
	constructor() {
		this.username = ''
		this.loginDate = Date.now()
	}

	isAuthorized(): boolean {
		return this.username !== ''
	}

	username: string
	loginDate: number
}
