type ApiUserCreate = {
	ok: boolean,
	msg: string
}
type ApiGame = {
	id: number,
	winnerId?: number,
	loserId?: number,
	winner?: {
		id: number,
		login: string,
		password: string,
		url_avatar: string
	},
	loser?: {
		id: number,
		login: string,
		password: string,
		url_avatar: string
	},
	leftScore: number,
	rightScore: number,
	date: string
}

type ApiUser = {
	id: number,
	login: string,
	password: string,
	url_avatar: string,
	wonGames?: ApiGame[],
	lostGames?: ApiGame[]
}

type ApiUserLogin = {
	ok: boolean,
	msg: ApiUser
}

type ApiUserCheckExist = {
	ok: boolean,
	msg: string | ApiUser
}

type ApiUpdateUser = {
	id: number,
	login: string,
	status: string,
	url_avatar: string,
}

type ApiGameSettings = {
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

type ApiGameLoop = {
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

type ApiFetchedUser = {
	id: number,
	login: string,
	status: string,
	url_avatar: string,
}

export enum ApiUserStatus {
	Regular = 'green',
	Searching = 'yellow',
	FoundEnemy = 'orange',
	Accepted = 'red',
	InGame = 'inGame',
	Declined = 'blue',
	Offline = 'offline'
}

export type {
	ApiFetchedUser,
	ApiGame,
	ApiGameLoop,
	ApiGameSettings,
	ApiUpdateUser,
	ApiUser,
	ApiUserCheckExist,
	ApiUserCreate,
	ApiUserLogin
};
