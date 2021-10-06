type UserCreate = {
	ok: boolean,
	msg: string
}

type GetUser = {
	games: number,
	id: number,
	login: string,
	password: string,
	url_avatar: string,
	wins: number
}

type UserLogin = {
	ok: boolean,
	msg: GetUser
}

type UserCheckExist = {
	ok: boolean,
	msg: string | GetUser
}

export type {
	GetUser,
	UserCheckExist,
	UserCreate,
	UserLogin
}
