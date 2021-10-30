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
	url_avatar: string,
}

type GameSettings = {
	id: number,
	canvasWidth: number,
	canvasHeight: number,
	playerWidth: number,
	playerMargin: number,
	playerHeight: number,
	playerStep: number,
	ballSize: number,
	ballAngle: number,
	ballSpeed: number,
	fps: number,
	leftPlayerUsername: string,
	rightPlayerUsername: string
}

type GameLoop = {
	b: {
		x: number,
		y: number
	},
	lP: {
		y: number
	},
	rP: {
		y: number
	}
}

type FetchedUsers = {
	login: string,
	status: string,
	url_avatar: string,
}

type GetAll = {
	id: number,
	login: string,
	password: string,
	url_avatar: string,
}

export enum UserStatus {
	Regular = 'green',
	Searching = 'yellow',
	FoundEnemy = 'orange',
	Accepted = 'red',
	InGame = 'inGame',
	Declined = 'blue',
	Offline = 'offline'
}

export type {
	FetchedUsers,
	GameLoop,
	GameSettings,
	GetAll,
	GetUser,
	UpdateUser,
	UserCheckExist,
	UserCreate,
	UserLogin
};
