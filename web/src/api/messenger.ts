import { AxiosResponse } from "axios";
import { ApiChannelExpand, ApiChat, ApiChatExpand } from "models/ApiTypes";

import { api } from "./api";

export const getChats = (): Promise<ApiChatExpand[]> => {
	return api.get<ApiChatExpand[]>('/chats', {
		params: { expand: '' },
	})
		.then((res) => res.data);
};

export const getChannels = (): Promise<ApiChannelExpand[]> => {
	return api.get<ApiChannelExpand[]>('/channels', {
		params: { expand: '' },
	})
		.then((res) => res.data);
};

interface ICreateChatReq {
	userTwoId: number;
}

export const createChat = (userTwoId: number) => {
	return api.post<ICreateChatReq, AxiosResponse<ApiChat>>('/chats/create', { userTwoId })
		.then((res) => res.data);
};

interface ICreateChannelReq {
	name: string;
	title: string;
	isPrivate: boolean;
	password: string | null;
}

export const createChannel = (name: string, title: string, isPrivate: boolean, password: string | null) => {
	return api.post<ICreateChannelReq, AxiosResponse<null>>('/channels/create', {
		name,
		title,
		isPrivate,
		password,
	})
		.then((res) => res.data);
};

export const leaveChannel = (channelId: number) => {
	return api.post('/channels/leave', { channelId })
		.then((res) => res.data)
		.catch(() => {});
};

export const updateChannel = (channelId: number, isPrivate: boolean, password: string | null) => {
	return api.put('/channels/update', { channelId, isPrivate, password })
		.then((res) => res.data);
};

export const updateChannelMemberStatus = (channelId: number, memberId: number, status: string) => {
	return api.put('/channels/updateMemberStatus', {
		channelId,
		memberId,
		status,
	})
		.then((res) => res.data);
};

export const muteChannelMember = (channelId: number, memberId: number, unbanDate: string | null) => {
	return api.post('/channels/muteMember', {
		channelId,
		memberId,
		unbanDate,
	})
		.then((res) => res.data);
};

export const unmuteChannelMember = (channelId: number, memberId: number) => {
	return api.post('/channels/unmuteMember', { channelId, memberId })
		.then((res) => res.data);
};

export const joinChannel = (channelId: number) => {
	return api.post('/channels/join', { channelId })
		.then((res) => res.data);
};

export const joinPrivateChannel = (channelId: number, password: string) => {
	return api.post('/channels/join', { channelId, password })
		.then((res) => res.data);
};

export const muteChatMember = (chatId: number, memberId: number, unbanDate: string | null) => {
	return api.post('/chats/muteMember', { chatId, memberId, unbanDate })
		.then((res) => res.data);
};

export const unmuteChatMember = (chatId: number, memberId: number) => {
	return api.post('/chats/unmuteMember', { chatId, memberId })
		.then((res) => res.data);
};
