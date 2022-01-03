import {createSlice} from "@reduxjs/toolkit";
import {io, Socket} from "socket.io-client";

interface SocketState {
	socket: Socket;
}

const initialState: SocketState = {
	socket: io(process.env.REACT_APP_API_URL || 'http://localhost:3000') as Socket,
};

export const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		// setSocket: (state: SocketState, action: PayloadAction<Socket>) => {
		// 	state.socket = action.payload;
		// },
	},
});

// export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;
