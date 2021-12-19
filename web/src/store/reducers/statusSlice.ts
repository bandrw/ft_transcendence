import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUserStatus } from 'models/ApiTypes';

interface StatusState {
	status: ApiUserStatus;
}

const initialState: StatusState = {
	status: ApiUserStatus.Regular,
};

export const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		setStatus: (state: StatusState, action: PayloadAction<ApiUserStatus>) => {
			state.status = action.payload;
		},
	},
});

export const { setStatus } = statusSlice.actions;

export default statusSlice.reducer;
