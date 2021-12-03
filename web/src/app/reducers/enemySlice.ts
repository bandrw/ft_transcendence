import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUpdateUser } from "models/apiTypes";

interface EnemyState {
	enemy: ApiUpdateUser | null
}

const initialState: EnemyState = {
	enemy: null
};

export const enemySlice = createSlice({
	name: 'enemy',
	initialState,
	reducers: {
		setEnemy: (state, action: PayloadAction<ApiUpdateUser | null>) => {
			state.enemy = action.payload;
		},
	},
});

export const { setEnemy } = enemySlice.actions;

export default enemySlice.reducer;
