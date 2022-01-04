export enum ApiUserStatus {
	Regular = "green",
	Searching = "yellow",
	FoundEnemy = "orange",
	Accepted = "red",
	InGame = "inGame",
	Declined = "blue",
	Offline = "offline",
}

export interface ApiUserCreate {
	ok: boolean;
	msg: string;
}

export interface ApiUser {
	id: number;
	login: string;
	url_avatar: string;
	phoneNumber: string | null;
}

export interface ApiGame {
	id: number;
	winnerId?: number;
	loserId?: number;
	winner?: ApiUser;
	loser?: ApiUser;
	leftScore: number;
	rightScore: number;
	date: string;
}

export interface ApiChat {
	id: number;
	userOneId: number;
	userTwoId: number;
}

export interface ApiMessage {
	id: number;
	chatId: number;
	channelId: number;
	fromUserId: number;
	text: string;
	date: number;
}

export interface ApiBanList {
	id: number;
	initiatorId: number;
	memberId: number;
	chatId: number;
	channelId: number;
	unbanDate: string;
}

export interface ApiChannelMember {
	id: number;
	login: string;
	url_avatar: string;
	isAdmin: boolean;
	banLists: ApiBanList[];
}

export interface ApiChannel {
	id: number;
	name: string;
	title: string;
	isPrivate: boolean;
	password?: string;
	ownerId: number;
}

export interface ApiChannelExpand {
	id: number;
	name: string;
	title: string;
	isPrivate: boolean;
	password?: string;
	ownerId: number;
	members: ApiChannelMember[];
	messages: ApiMessage[];
}

export interface ApiUserExpand {
	readonly [key: string]: number | string | undefined | null |
		ApiGame[] | ApiUser[] | ApiChat[] | ApiMessage[] | ApiChannel[];
	id: number;
	login: string;
	url_avatar: string;
	intraLogin?: string;
	phoneNumber: string | null;
	wonGames: ApiGame[];
	lostGames: ApiGame[];
	subscriptions: ApiUser[];
	subscribers: ApiUser[];
	createdChats: ApiChat[];
	acceptedChats: ApiChat[];
	messages: ApiMessage[];
	ownedChannels: ApiChannel[];
	channels: ApiChannelExpand[];
}

export interface ApiUserLogin {
	access_token: string | null;
	twoFactorAuthentication: boolean;
}

export interface ApiUpdateUser {
	id: number;
	login: string;
	url_avatar: string;
	phoneNumber: string | null;
	status: ApiUserStatus;
	subscriptions: ApiUser[];
	subscribers: ApiUser[];
}

export interface GamePlayerType {
	id: number;
	login: string;
	url_avatar: string;
	status: string;
}

export interface ApiGameSettings {
	id: string;
	canvasWidth: number;
	canvasHeight: number;
	playerWidth: number;
	playerMargin: number;
	playerHeight: number;
	playerStep: number;
	ballSize: number;
	ballAngle: number;
	ballSpeed: number;
	fps: number;
	leftPlayer: GamePlayerType;
	rightPlayer: GamePlayerType;
	score: {
		leftPlayer: number;
		rightPlayer: number;
	};
}

export interface ApiGameLoop {
	b: {
		x: number;
		y: number;
	};
	lP: {
		y: number;
	};
	rP: {
		y: number;
	};
}

export interface ApiChatExpand {
	id: number;
	userOneId: number;
	userTwoId: number;
	userOne: ApiUser;
	userTwo: ApiUser;
	messages: ApiMessage[];
	banLists: ApiBanList[];
}

export interface IAuthIntraReq {
	code: string;
	smsCode: string | null;
	intraToken: string | null;
}

export interface IAuthIntraRes {
	access_token: string | null;
	twoFactorAuthentication: boolean;
}
