import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUserExpand } from "models/ApiTypes";

interface AllUsersState {
	allUsers: ApiUserExpand[]
}

const initialState: AllUsersState = {
	allUsers: []
};

export const allUsersSlice = createSlice({
	name: 'allUsers',
	initialState,
	reducers: {
		setAllUsers: (state, action: PayloadAction<ApiUserExpand[]>) => {
			state.allUsers = action.payload;
		},
	},
});

export const { setAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
