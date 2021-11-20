import React from 'react';
import { io, Socket } from "socket.io-client";

export const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000');

export const SocketContext = React.createContext<Socket>(socket);
