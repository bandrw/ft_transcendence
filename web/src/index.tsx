import './index.scss';

import axios from "axios";
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { socket, SocketContext } from "./context/socket";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

ReactDOM.render(
		<React.StrictMode>
			<SocketContext.Provider value={ socket }>
				<App/>
			</SocketContext.Provider>
		</React.StrictMode>,
		document.getElementById('root')
);
