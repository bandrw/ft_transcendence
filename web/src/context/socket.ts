import React from 'react';
import { io, Socket } from "socket.io-client";

export const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000');

socket.on("disconnect", (reason) => {
	if (reason === "io server disconnect")
		socket.connect();
});

// socket.on("connect_error", (error) => {
// 	console.log('connect_error', error);
// });

// socket.onAny((event, data) => {
// 	console.log(`[socket context] got ${event}`);
// });

// console.log('Listeners added');

export const SocketContext = React.createContext<Socket>(socket);
