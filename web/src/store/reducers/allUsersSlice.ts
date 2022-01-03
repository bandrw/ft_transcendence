import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ApiUserExpand } from 'models/ApiTypes';

import * as AuthApi from "../../api/auth";
import {fetchAllUsers} from "../../api/user";

interface AllUsersState {
	allUsers: ApiUserExpand[];
}

const initialState: AllUsersState = {
	allUsers: [],
};

export const fetchAllUsersAction = createAsyncThunk(
	'allUsers/fetchAllUsers',
	async () => {
		// eslint-disable-next-line no-return-await
		return await fetchAllUsers();
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
		[fetchAllUsersAction.fulfilled.type]: (state: AllUsersState, action: PayloadAction<ApiUserExpand[]>) => {
			state.allUsers = action.payload;
		},
	},
});

export const { setAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
