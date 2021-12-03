import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUserStatus } from "models/apiTypes";

interface statusState {
	status: ApiUserStatus
}

const initialState: statusState = {
	status: ApiUserStatus.Regular
};

export const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		setStatus: (state, action: PayloadAction<ApiUserStatus>) => {
			state.status = action.payload;
		},
	},
});

export const { setStatus } = statusSlice.actions;

export default statusSlice.reducer;
