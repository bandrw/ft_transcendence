type userLogin = {
	games: number,
	id: number,
	login: string,
	password: string,
	url_avatar: string,
	wins: number
}

type userCreate = {
	ok: boolean,
	msg: string
}

export {
	userLogin,
	userCreate
}
