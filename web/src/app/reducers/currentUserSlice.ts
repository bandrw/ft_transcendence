import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from "models/User";

interface CurrentUserState {
	currentUser: User
}

const initialState: CurrentUserState = {
	currentUser: new User()
};

export const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		setCurrentUser: (state: CurrentUserState, action: PayloadAction<User>) => {
			state.currentUser = action.payload;
		},
	},
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
