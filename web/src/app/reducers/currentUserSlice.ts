import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IUser } from 'models/User';

import {logout} from "../../api/auth";
import {removeToken} from "../token";

interface CurrentUserState {
	currentUser: IUser;
}

const initialState: CurrentUserState = {
	currentUser: {
		id: -1,
		username: '',
		urlAvatar: '',
		loginDate: 0,
		intraLogin: null,
		isAuthorized: false,
	},
};

export const logoutAction = createAsyncThunk(
	'currentUser/logout',
	async () => {
		await logout();
	},
);

export const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		setCurrentUser: (state: CurrentUserState, action: PayloadAction<IUser>) => {
			state.currentUser = action.payload;
			state.currentUser.isAuthorized = true;
		},
		resetCurrentUser: (state: CurrentUserState) => {
			state.currentUser = initialState.currentUser;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(logoutAction.fulfilled, (state) => {
			state.currentUser = initialState.currentUser;
			removeToken();
		});
	},
});

export const { setCurrentUser, resetCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
