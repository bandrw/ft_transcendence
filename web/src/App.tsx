import './App.scss';

import axios from 'axios';
import { AuthRoute } from "components/AuthRoute";
import { PrivateRoute } from "components/PrivateRoute";
import { SocketContext } from 'context/socket';
import { useAppDispatch, useAppSelector } from 'hook/reduxHooks';
import {useAuth} from "hook/useAuth";
import { ApiGameSettings, ApiUpdateUser, ApiUser, ApiUserExpand, ApiUserStatus } from 'models/ApiTypes';
import { User } from "models/User";
import Game from 'pages/Game';
import GamesHistory from 'pages/GamesHistory';
import Login from 'pages/Login';
import Main from 'pages/Main';
import NotFound from "pages/NotFound";
import Register from 'pages/Register';
import UserProfile from 'pages/UserProfile';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Switch, useHistory } from "react-router-dom";
import { getAllUsersAction } from 'store/reducers/allUsersSlice';
import { getCurrentUserAction, resetCurrentUser, setCurrentUser } from "store/reducers/currentUserSlice";
import { setEnemy, setEnemyIsReady } from 'store/reducers/enemySlice';
import {setGameSettings} from "store/reducers/gameSlice";
import {getOnlineUsersAction, removeOnlineUser, setOnlineUsers} from 'store/reducers/onlineUsersSlice';
import { setStatus } from 'store/reducers/statusSlice';
import { getToken, removeToken } from 'utils/token';

export const getCurrentUser = async (accessToken: string, socketId: string): Promise<User | null> => {
	try {
		const usr = await axios
			.get<ApiUser | null>('/auth', {
				params: { socketId },
				headers: { Authorization: `Bearer ${accessToken}` },
			})
			.then((res) => res.data);

		if (usr) {
			const user = new User();
			user.id = usr.id;
			user.username = usr.login;
			user.urlAvatar = usr.url_avatar;

			return user;
		}

		return null;
	} catch {
		return null;
	}
};

const App = () => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const socket = React.useContext(SocketContext);
	const [socketId, setSocketId] = React.useState<string | null>(null);
	// const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);
	const sockId = socketId || socket.id;

	const isAuth = useAuth();

	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { onlineUsers } = useAppSelector((state) => state.onlineUsers);
	const { status } = useAppSelector((state) => state.status);
	const { enemy } = useAppSelector((state) => state.enemy);
	const dispatch = useAppDispatch();

	// Fetching onlineUsers
	React.useEffect(() => {
		let isMounted = true;

		if (!isAuth || !isMounted) {
			return;
		}

		dispatch(getOnlineUsersAction());

		return () => {
			isMounted = false;
		};
	}, [isAuth, dispatch]);

	// Fetching allUsers + updating on onlineUsers change
	React.useEffect(() => {
		let isMounted = true;

		if (!isAuth || !isMounted) {
			return;
		}

		dispatch(getAllUsersAction());

		return () => {
			isMounted = false;
		};
	}, [isAuth, dispatch, onlineUsers]);

	// Getting user from access_token
	React.useEffect(() => {
		if (sockId) {
			dispatch(getCurrentUserAction(sockId));
		}
	}, [dispatch, sockId]);

	// Saving socketId in state
	React.useEffect(() => {
		const connectHandler = () => {
			setSocketId(socket.id);
		};

		const disconnectHandler = (reason: string) => {
			setSocketId(null);

			if (reason === 'io server disconnect') socket.connect();
		};

		// TODO можно придумать что-то получше
		const sockInterval = setInterval(() => {
			if (sockId) {
				clearInterval(sockInterval);
			}

			if (socket.id) {
				setSocketId(socket.id);
				clearInterval(sockInterval);
			}
		}, 100);

		socket.on('connect', connectHandler);
		socket.on('disconnect', disconnectHandler);

		return () => {
			socket.off('connect', connectHandler);
			socket.off('disconnect', disconnectHandler);
		};
	}, [sockId, socket]);

	// Event handlers
	React.useEffect(() => {
		if (!isAuth) {
			return;
		}

		const logoutHandler = (data: string) => {
			const logoutData: ApiUpdateUser = JSON.parse(data);
			dispatch(removeOnlineUser(logoutData));
		};

		const gameSettingsHandler = (e: string) => {
			const gameSettings: ApiGameSettings = JSON.parse(e);
			dispatch(setGameSettings(gameSettings));

			// If watch mode is on, don't send start
			if (
				gameSettings.leftPlayer.login !== currentUser.username &&
				gameSettings.rightPlayer.login !== currentUser.username
			) {
				return;
			}

			const data = {
				login: currentUser.username,
				id: gameSettings.id,
			};
			setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
		};

		const updateUserHandler = (data: string) => {
			const updateUserData: ApiUpdateUser[] = JSON.parse(data);

			dispatch(setOnlineUsers(updateUserData));

			// Update currentUser
			const currUsr = updateUserData.find((usr) => usr.id === currentUser.id);

			if (currUsr) {
				currentUser.username = currUsr.login;
				currentUser.urlAvatar = currUsr.url_avatar;
				dispatch(setCurrentUser(currentUser));
			}

			if (enemy) {
				const enemyData = updateUserData.find((usr) => usr.id === enemy.id);

				if (enemyData)
					dispatch(setEnemy(enemyData));

				if (!enemyData) return;

				const enemyDeclinedGame =
					enemyData.status === ApiUserStatus.Declined || enemyData.status === ApiUserStatus.Regular;
				const enemyAcceptedGame = enemyData.status === ApiUserStatus.Accepted;

				if (enemyDeclinedGame) {
					dispatch(setStatus(ApiUserStatus.Regular));
					dispatch(setEnemyIsReady(false));
					dispatch(setEnemy(null));
				} else if (enemyAcceptedGame) {
					dispatch(setEnemyIsReady(true));
				}
			}
		};

		const enemyHandler = (e: string) => {
			const enemyData: ApiUpdateUser = JSON.parse(e);
			dispatch(setEnemy(enemyData));
			dispatch(setStatus(ApiUserStatus.FoundEnemy));
		};

		const gameIsReadyHandler = () => {
			dispatch(setStatus(ApiUserStatus.InGame));
		};

		socket.on('logout', logoutHandler);
		socket.on('updateUser', updateUserHandler);
		socket.on('enemy', enemyHandler);
		socket.on('gameIsReady', gameIsReadyHandler);
		socket.on('gameSettings', gameSettingsHandler);

		return () => {
			socket.off('logout', logoutHandler);
			socket.off('updateUser', updateUserHandler);
			socket.off('enemy', enemyHandler);
			socket.off('gameIsReady', gameIsReadyHandler);
			socket.off('gameSettings', gameSettingsHandler);
		};
	}, [isAuth, currentUser, socket, onlineUsers, dispatch, status, enemy]);

	if (!isDesktop) return <div style={{ fontSize: '2em', marginTop: '100px' }}>Window is too small :(</div>;

	return (
		<Switch>
			<AuthRoute exact path="/login">
				<Login socketId={sockId} />
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
};

export default App;
