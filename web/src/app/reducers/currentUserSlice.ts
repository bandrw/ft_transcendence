import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { IUser } from 'models/User';

import * as AuthApi from "../../api/auth";
import { removeToken } from "../token";

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
		await AuthApi.logout();
	},
);

export const getCurrentUserAction = createAsyncThunk(
	'currentUser/getCurrentUser',
	async (sockId: string, { rejectWithValue }) => {
		try {
			const user = await AuthApi.getCurrentUser(sockId);

			if (user) {
				const { id, login, url_avatar } = user;

				return {
					id,
					login,
					url_avatar,
				};
			}

			return rejectWithValue('');
		} catch {
			return rejectWithValue('');
		}
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
	extraReducers: {
		[logoutAction.fulfilled.type]: (state) => {
			removeToken();
			state.currentUser = initialState.currentUser;
		},
		[getCurrentUserAction.fulfilled.type]: (state: CurrentUserState, action: PayloadAction<IUser>) => {
			state.currentUser = action.payload;
			state.currentUser.isAuthorized = true;
		},
		[getCurrentUserAction.rejected.type]: (state) => {
			removeToken();
			state.currentUser = initialState.currentUser;
		},
	},
});

export const { setCurrentUser, resetCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
