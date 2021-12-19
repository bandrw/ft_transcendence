import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ApiGameSettings, ApiUpdateUser} from 'models/ApiTypes';

interface GameState {
	settings: ApiGameSettings | null;
}

const initialState: GameState = {
	settings: null,
};

export const GameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setGameSettings: (state: GameState, action: PayloadAction<ApiGameSettings>) => {
			state.settings = action.payload;
		},
		resetGameSettings: (state: GameState) => {
			state.settings = null;
		},
	},
});

export const { setGameSettings, resetGameSettings } = GameSlice.actions;

export default GameSlice.reducer;
