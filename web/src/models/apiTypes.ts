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

type ApiUser = {
	id: number,
	login: string,
	password: string,
	url_avatar: string
}

type ApiGame = {
	id: number,
	winnerId?: number,
	loserId?: number,
	winner?: ApiUser,
	loser?: ApiUser,
	leftScore: number,
	rightScore: number,
	date: string
}

type ApiUserExpand = {
	id: number,
	login: string,
	password: string,
	url_avatar: string,
	intraLogin?: string,
	wonGames: ApiGame[],
	lostGames: ApiGame[],
	subscriptions: ApiUser[],
	subscribers: ApiUser[]
}

type ApiUserLogin = {
	ok: boolean,
	msg: ApiUser
}

type ApiUpdateUser = {
	id: number,
	login: string,
	url_avatar: string,
	status: ApiUserStatus,
	subscriptions: ApiUser[],
	subscribers: ApiUser[]
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

type ApiChat = {
	id: number,
	userOneId: number,
	userTwoId: number,
}

type ApiChatExpand = {
	id: number,
	userOneId: number,
	userTwoId: number,
	userOne: ApiUser,
	userTwo: ApiUser
}

export type {
	ApiChat,
	ApiChatExpand,
	ApiGame,
	ApiGameLoop,
	ApiGameSettings,
	ApiUpdateUser,
	ApiUser,
	ApiUserCreate,
	ApiUserExpand,
	ApiUserLogin,
};
