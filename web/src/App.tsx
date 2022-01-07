import './App.scss';

import { AuthRoute } from "components/AuthRoute";
import { PrivateRoute } from "components/PrivateRoute";
import { useAppSelector } from 'hook/reduxHooks';
import Game from 'pages/Game';
import GamesHistory from 'pages/GamesHistory';
import Login from 'pages/Login';
import Main from 'pages/Main';
import NotFound from "pages/NotFound";
import Register from 'pages/Register';
import UserProfile from 'pages/UserProfile';
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Switch } from "react-router-dom";

const App = React.memo(() => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const {socket, socket: { id }} = useAppSelector((state) => state.socket);
	const [socketId, setSocketId] = React.useState<string>(id);

	useEffect(() => {
		const connectHandler = () => {
			setSocketId(socket.id);
		};

		const disconnectHandler = (reason: string) => {
			setSocketId('');

			if (reason === 'io server disconnect') socket.connect();
		};

		socket.on('connect', connectHandler);
		socket.on('disconnect', disconnectHandler);

		return () => {
			socket.off('connect', connectHandler);
			socket.off('disconnect', disconnectHandler);
		};
	}, [socketId, socket]);

	if (!isDesktop) return <div style={{ fontSize: '2em', marginTop: '100px' }}>Window is too small :(</div>;

	return (
		<Switch>
			<AuthRoute exact path="/login">
				<Login/>
			</AuthRoute>

			<AuthRoute exact path="/register">
				<Register />
			</AuthRoute>

			<PrivateRoute exact path="/game">
				<Game />
			</PrivateRoute>

			<PrivateRoute path="/games/:login">
				<GamesHistory />
			</PrivateRoute>

			<PrivateRoute path="/users/:login">
				<UserProfile />
			</PrivateRoute>

			<PrivateRoute exact path="/">
				<Main />
			</PrivateRoute>

			<PrivateRoute>
				<NotFound/>
			</PrivateRoute>
		</Switch>
	);
});

export default App;
