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

type UpdateUser = {
	login: string,
	status: string,
	url_avatar: string
}

export enum UserStatus {
	Regular = 'green',
	Searching = 'yellow',
	FoundEnemy = 'orange',
	Accepted = 'red',
	InGame = 'inGame',
	Declined = 'blue'
}

export type {
	GetUser,
	UpdateUser,
	UserCheckExist,
	UserCreate,
	UserLogin
};
