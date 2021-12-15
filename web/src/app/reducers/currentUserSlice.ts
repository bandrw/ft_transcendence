import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, User } from 'models/User';

import { getToken } from "../token";

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
		isAuthorized: !!getToken(),
	},
};

export const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		setCurrentUser: (state: CurrentUserState, action: PayloadAction<User>) => {
			state.currentUser = action.payload;
			state.currentUser.isAuthorized = true;
		},
		resetCurrentUser: (state: CurrentUserState) => {
			state.currentUser = initialState.currentUser;
		},
	},
});

export const { setCurrentUser, resetCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
