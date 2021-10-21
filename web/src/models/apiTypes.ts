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

type GameSettings = {
	BallPosX: number,
	BallPosY: number,
	starter: boolean,
	id: number,
	enemyGameSettings: {
		platformWide: number,
		platformSpeed: number
	}
}

type GameLoop = {
	leftPlayer: {
		x: number,
		y: number
	},
	rightPlayer: {
		x: number,
		y: number
	},
	ball: {
		x: number,
		y: number
	}
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
	GameLoop,
	GameSettings,
	GetUser,
	UpdateUser,
	UserCheckExist,
	UserCreate,
	UserLogin
};
