import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUpdateUser } from 'models/ApiTypes';

import { getOnlineUsers } from "../../api/user";

interface OnlineUsersState {
	onlineUsers: ApiUpdateUser[];
}

const initialState: OnlineUsersState = {
	onlineUsers: [],
};

export const getOnlineUsersAction = createAsyncThunk(
	'allUsers/fetchAllUsers',
	async () => {
		// eslint-disable-next-line no-return-await
		return await getOnlineUsers();
	},
);

export const onlineUsersSlice = createSlice({
	name: 'onlineUsers',
	initialState,
	reducers: {
		setOnlineUsers: (state: OnlineUsersState, action: PayloadAction<ApiUpdateUser[]>) => {
			state.onlineUsers = action.payload;
		},
		removeOnlineUser: (state: OnlineUsersState, action: PayloadAction<ApiUpdateUser>) => {
			state.onlineUsers = state.onlineUsers.filter((user) => user.login !== action.payload.login);
		},
	},
	extraReducers: {
		[getOnlineUsersAction.fulfilled.type]: (state: OnlineUsersState, action: PayloadAction<ApiUpdateUser[]>) => {
			state.onlineUsers = action.payload;
		},
	},
});

export const { setOnlineUsers, removeOnlineUser } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
