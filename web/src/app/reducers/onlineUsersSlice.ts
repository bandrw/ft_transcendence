import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUpdateUser } from "models/apiTypes";

interface OnlineUsersState {
	onlineUsers: ApiUpdateUser[]
}

const initialState: OnlineUsersState = {
	onlineUsers: []
};

export const onlineUsersSlice = createSlice({
	name: 'onlineUsers',
	initialState,
	reducers: {
		setOnlineUsers: (state, action: PayloadAction<ApiUpdateUser[]>) => {
			state.onlineUsers = action.payload;
		},
	},
});

export const { setOnlineUsers } = onlineUsersSlice.actions;

export default onlineUsersSlice.reducer;
