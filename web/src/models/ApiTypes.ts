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

type ApiChat = {
	id: number,
	userOneId: number,
	userTwoId: number,
}

type ApiMessage = {
	id: number,
	chatId: number,
	channelId: number,
	fromUserId: number,
	text: string,
	date: number
}

type ApiBanList = {
	id: number,
	initiatorId: number,
	memberId: number,
	chatId: number,
	channelId: number,
	unbanDate: string
}

type ApiChannelMember = {
	id: number,
	login: string,
	url_avatar: string,
	isAdmin: boolean,
	banLists: ApiBanList[]
}

type ApiChannel = {
	id: number,
	name: string,
	title: string,
	isPrivate: boolean,
	password?: string,
	ownerId: number,
}

type ApiChannelExpand = {
	id: number,
	name: string,
	title: string,
	isPrivate: boolean,
	password?: string,
	ownerId: number,
	members: ApiChannelMember[],
	messages: ApiMessage[]
}

type ApiUserExpand = {
	id: number,
	login: string,
	url_avatar: string,
	intraLogin?: string,
	wonGames: ApiGame[],
	lostGames: ApiGame[],
	subscriptions: ApiUser[],
	subscribers: ApiUser[],
	createdChats: ApiChat[],
	acceptedChats: ApiChat[],
	messages: ApiMessage[],
	ownedChannels: ApiChannel[],
	channels: ApiChannelExpand[]
}

type ApiUserLogin = {
	access_token: string
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

type ApiChatExpand = {
	id: number,
	userOneId: number,
	userTwoId: number,
	userOne: ApiUser,
	userTwo: ApiUser,
	messages: ApiMessage[],
	banLists: ApiBanList[]
}

export type {
	ApiChannel,
	ApiChannelExpand,
	ApiChannelMember,
	ApiChat,
	ApiChatExpand,
	ApiGame,
	ApiGameLoop,
	ApiGameSettings,
	ApiMessage,
	ApiUpdateUser,
	ApiUser,
	ApiUserCreate,
	ApiUserExpand,
	ApiUserLogin,
};
