import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChannels, getChats } from "api/messenger";
import { getUserByLoginExpand } from "api/user";
import { ApiChannelExpand, ApiChatExpand, ApiMessage } from "models/ApiTypes";

export enum ChatState {
	Default = 'default',
	NewChat = 'newChat',
	NewChannel = 'newChannel',
	Settings = 'settings',
}

interface MessengerState {
	chats: ApiChatExpand[];
	channels: ApiChannelExpand[];
	selectedChat: ApiChatExpand | null;
	selectedChannel: ApiChannelExpand | null;
	chatState: ChatState;
	allChannels: ApiChannelExpand[];
}

const initialState: MessengerState = {
	chats: [],
	channels: [],
	selectedChat: null,
	selectedChannel: null,
	chatState: ChatState.Default,
	allChannels: [],
};

export const getChatsAction = createAsyncThunk(
	'messenger/fetchChats',
	async () => {
		// eslint-disable-next-line no-return-await
		return await getChats();
	},
);

export const getChannelsAction = createAsyncThunk(
	'messenger/fetchChannels',
	async (username: string) => {
		const user = await getUserByLoginExpand(username);

		return user?.channels || [];
	},
);

export const getAllChannelsAction = createAsyncThunk(
	'messenger/fetchAllChannels',
	async () => {
		// eslint-disable-next-line no-return-await
		return await getChannels();
	},
);

export const messengerSlice = createSlice({
	name: 'messenger',
	initialState,
	reducers: {
		setSelectedChat: (state: MessengerState, action: PayloadAction<ApiChatExpand | null>) => {
			state.selectedChat = action.payload;
		},
		setSelectedChannel: (state: MessengerState, action: PayloadAction<ApiChannelExpand | null>) => {
			state.selectedChannel = action.payload;
		},
		setChatState: (state: MessengerState, action: PayloadAction<ChatState>) => {
			state.chatState = action.payload;
		},
		setChats: (state: MessengerState, action: PayloadAction<ApiChatExpand[]>) => {
			state.chats = action.payload;
		},
		addNewChat: (state: MessengerState, action: PayloadAction<ApiChatExpand>) => {
			state.chats = [...state.chats, action.payload];
		},
		addNewChannel: (state: MessengerState, action: PayloadAction<ApiChannelExpand>) => {
			state.allChannels = [...state.allChannels, action.payload];
		},
		addNewMessage: (state: MessengerState, action: PayloadAction<ApiMessage>) => {
			const { payload: msg } = action;

			if (msg.chatId) {
				const chat = state.chats.find((c) => c.id === msg.chatId);

				if (chat) chat.messages = chat.messages.concat(msg);

			} else if (msg.channelId) {
				const channel = state.allChannels.find((c) => c.id === msg.channelId);

				if (channel) channel.messages = channel.messages.concat(msg);

			}
		},
		setDefaultChatState: (state: MessengerState) => {
			state.chatState = ChatState.Default;
			state.selectedChat = null;
		},
		closeSelectedChat: (state: MessengerState) => {
			state.selectedChat = null;
			state.selectedChannel = null;
		},
	},
	extraReducers: {
		[getChatsAction.fulfilled.type]: (state: MessengerState, action: PayloadAction<ApiChatExpand[]>) => {
			state.chats = action.payload;
		},
		[getChannelsAction.fulfilled.type]: (state: MessengerState, action: PayloadAction<ApiChannelExpand[]>) => {
			state.channels = action.payload;
		},
		[getAllChannelsAction.fulfilled.type]: (state: MessengerState, action: PayloadAction<ApiChannelExpand[]>) => {
			state.allChannels = action.payload;
		},
	},
});

export const {
	setSelectedChat,
	setSelectedChannel,
	setChatState,
	setChats,
	addNewChat,
	addNewChannel,
	addNewMessage,
	setDefaultChatState,
	closeSelectedChat,
} = messengerSlice.actions;

export default messengerSlice.reducer;
