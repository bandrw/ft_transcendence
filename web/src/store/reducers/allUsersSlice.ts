import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ApiUserExpand } from 'models/ApiTypes';

import * as AuthApi from "../../api/auth";
import {getAllUsers} from "../../api/user";

interface AllUsersState {
	allUsers: ApiUserExpand[];
}

const initialState: AllUsersState = {
	allUsers: [],
};

export const getAllUsersAction = createAsyncThunk(
	'allUsers/fetchAllUsers',
	async () => {
		// eslint-disable-next-line no-return-await
		return await getAllUsers();
	},
);

export const allUsersSlice = createSlice({
	name: 'allUsers',
	initialState,
	reducers: {
		setAllUsers: (state: AllUsersState, action: PayloadAction<ApiUserExpand[]>) => {
			state.allUsers = action.payload;
		},
	},
	extraReducers: {
		[getAllUsersAction.fulfilled.type]: (state: AllUsersState, action: PayloadAction<ApiUserExpand[]>) => {
			state.allUsers = action.payload;
		},
	},
});

export const { setAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
