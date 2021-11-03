export enum ApiUserStatus {
	Regular = 'green',
	Searching = 'yellow',
	FoundEnemy = 'orange',
	Accepted = 'red',
	InGame = 'inGame',
	Declined = 'blue',
	Offline = 'offline'
}

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
	intraLogin?: string,
	wonGames?: ApiGame[],
	lostGames?: ApiGame[]
}

type ApiOnlineUser = {
	id: number,
	login: string,
	url_avatar: string,
	status: ApiUserStatus
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
	url_avatar: string,
	status: ApiUserStatus,
}

type ApiGameSettings = {
	id: string,
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
	leftPlayer: {
		id: number,
		login: string,
		url_avatar: string,
		status: string
	},
	rightPlayer: {
		id: number,
		login: string,
		url_avatar: string,
		status: string
	},
	score: {
		leftPlayer: number,
		rightPlayer: number
	}
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

export type {
	ApiFetchedUser,
	ApiGame,
	ApiGameLoop,
	ApiGameSettings,
	ApiOnlineUser,
	ApiUpdateUser,
	ApiUser,
	ApiUserCheckExist,
	ApiUserCreate,
	ApiUserLogin
};
