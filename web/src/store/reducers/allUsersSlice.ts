import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getAllUsers} from "api/user";
import { ApiUserExpand } from 'models/ApiTypes';

interface AllUsersState {
	allUsers: ApiUserExpand[];
}

const initialState: AllUsersState = {
	allUsers: [],
};

export const getAllUsersAction = createAsyncThunk(
	'allUsers/getAllUsers',
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
