import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiUpdateUser } from 'models/ApiTypes';

interface EnemyState {
	enemy: ApiUpdateUser | null;
	enemyIsReady: boolean;
}

const initialState: EnemyState = {
	enemy: null,
	enemyIsReady: false,
};

export const enemySlice = createSlice({
	name: 'enemy',
	initialState,
	reducers: {
		setEnemy: (state: EnemyState, action: PayloadAction<ApiUpdateUser | null>) => {
			state.enemy = action.payload;
		},
		setEnemyIsReady: (state: EnemyState, action: PayloadAction<boolean>) => {
			state.enemyIsReady = action.payload;
		},
	},
});

export const { setEnemy, setEnemyIsReady } = enemySlice.actions;

export default enemySlice.reducer;
