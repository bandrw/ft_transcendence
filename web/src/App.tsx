import './App.scss';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { setAllUsers } from "app/reducers/allUsersSlice";
import { setCurrentUser } from "app/reducers/currentUserSlice";
import { setOnlineUsers } from "app/reducers/onlineUsersSlice";
import { setStatus } from "app/reducers/statusSlice";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiGameSettings, ApiUpdateUser, ApiUser, ApiUserExpand, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import Game from "pages/Game";
import GamesHistory from "pages/GamesHistory";
import Login from 'pages/Login';
import Main from "pages/Main";
import Register from "pages/Register";
import UserProfile from "pages/UserProfile";
import React from 'react';
import { useMediaQuery } from "react-responsive";
import { Route, Switch, useHistory } from "react-router-dom";

export const getCurrentUser = async (access_token: string, socketId: string, strategy: string): Promise<User | null> => {
	if (strategy === 'local') {
		try {
			const usr = await axios.get<ApiUser | null>('/auth', {
				params: { socketId: socketId },
				headers: { Authorization: `Bearer ${access_token}` }
			})
				.then(res => res.data);
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
	}

	if (strategy === 'intra') {
		try {
			const r = await axios.post<any, any>('/auth/intra', {
				code: access_token
			})
				.then(res => res.data);
			localStorage.setItem('access_token', r.access_token);
			return await getCurrentUser(r.access_token, socketId, 'local');
		} catch {
			return null;
		}
	}

	return null;
};

const App = () => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const history = useHistory();
	const socket = React.useContext(SocketContext);
	const enemyRef = React.useRef<ApiUpdateUser | null>(null);
	const gameSettingsRef = React.useRef<ApiGameSettings | null>(null);
	const gameRef = React.useRef<{ runs: boolean, interval: null | NodeJS.Timeout }>({ runs: false, interval: null });
	const onlineUsersRef = React.useRef<ApiUpdateUser[]>([]);
	const [socketId, setSocketId] = React.useState<string | null>(null);
	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);

	const { currentUser } = useAppSelector(state => state.currentUser);
	const { onlineUsers } = useAppSelector(state => state.onlineUsers);
	const { status } = useAppSelector(state => state.status);
	const dispatch = useAppDispatch();

	// Saving onlineUsers in onlineUsersRef
	React.useEffect(() => {
		onlineUsersRef.current = onlineUsers;
	}, [onlineUsers, onlineUsersRef]);

	// // Updating allUsers on onlineUsers change // todo
	// React.useEffect(() => {
	// 	const updated: ApiUserExpand[] = allUsers.map(usr => {
	// 		const onlineUsr = onlineUsers.find(u => u.id === usr.id);
	// 		if (!onlineUsr)
	// 			return usr;
	//
	// 		return {
	// 			id: usr.id,
	// 			login: usr.login,
	// 			url_avatar: usr.url_avatar,
	// 			intraLogin: usr.intraLogin,
	// 			wonGames: usr.wonGames,
	// 			lostGames: usr.lostGames,
	// 			subscriptions: onlineUsr.subscriptions,
	// 			subscribers: onlineUsr.subscribers,
	// 			createdChats: usr.createdChats,
	// 			acceptedChats: usr.acceptedChats,
	// 			messages: usr.messages,
	// 			ownedChannels: usr.ownedChannels,
	// 			channels: usr.channels
	// 		};
	// 	});
	// 	dispatch(setAllUsers(updated));
	// }, [dispatch, onlineUsers]);

	// Fetching onlineUsers
	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiUpdateUser[]>('/users/online', {
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(res => {
				if (!isMounted)
					return ;
				dispatch(setOnlineUsers(res.data));
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser, dispatch]);

	// Fetching allUsers
	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiUserExpand[]>('/users', {
			params: { expand: '' },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(res => {
				if (!isMounted)
					return ;

				dispatch(setAllUsers(res.data));
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser, dispatch]);

	// Getting user from access_token
	React.useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		const sockId = socketId ? socketId : socket.id;

		if (accessToken && sockId) {
			getCurrentUser(accessToken, sockId, 'local')
				.then(usr => {
					if (usr) {
						dispatch(setCurrentUser(usr));
					} else {
						localStorage.removeItem('access_token');
						dispatch(setCurrentUser(new User()));
					}
				});
		}

	}, [dispatch, socket.id, socketId]);

	// Saving socketId in state
	React.useEffect(() => {

		const connectHandler = () => {
			setSocketId(socket.id);
		};

		const disconnectHandler = (reason: string) => {
			setSocketId(null);
			if (reason === 'io server disconnect')
				socket.connect();
		};

		socket.on('connect', connectHandler);
		socket.on('disconnect', disconnectHandler);

		return () => {
			socket.off('connect', connectHandler);
			socket.off('disconnect', disconnectHandler);
		};
	}, [socket]);

	// Redirect to /login
	React.useEffect(() => {
		if (
			history.location.pathname !== '/login' && history.location.pathname !== '/register' &&
			!localStorage.getItem('access_token')
		) {
			history.push('/login');
		}
	}, [currentUser, history]);

	// Event handlers
	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return;

		const logoutHandler = (data: string) => {
			const logoutData: ApiUpdateUser = JSON.parse(data);
			dispatch(setOnlineUsers(onlineUsersRef.current.filter(usr => usr.login !== logoutData.login)));
		};

		const gameSettingsHandler = (e: string) => {
			const gameSettings: ApiGameSettings = JSON.parse(e);
			gameSettingsRef.current = gameSettings;

			// If watch mode is on, don't send start
			if (gameSettings.leftPlayer.login !== currentUser.username && gameSettings.rightPlayer.login !== currentUser.username)
				return ;

			const data = {
				login: currentUser.username,
				id: gameSettings.id
			};
			setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
		};

		const updateUserHandler = (data: string) => {
			const updateUserData: ApiUpdateUser = JSON.parse(data);

			const updatedUsers: ApiUpdateUser[] = [];
			// Edit user
			for (let user of onlineUsers) {
				if (user.login === updateUserData.login) {
					updatedUsers.push(updateUserData);
				} else {
					updatedUsers.push(user);
				}
			}
			// Add new user
			if (!onlineUsers.find(usr => usr.login === updateUserData.login))
				updatedUsers.push(updateUserData);
			dispatch(setOnlineUsers(updatedUsers));

			if (!enemyRef.current && status !== ApiUserStatus.Regular) {
				dispatch(setStatus(ApiUserStatus.Regular));
			} else if (enemyRef.current && updateUserData.login === enemyRef.current.login && (updateUserData.status === ApiUserStatus.Declined || updateUserData.status === ApiUserStatus.Regular)) {
				dispatch(setStatus(ApiUserStatus.Regular));
				setEnemyIsReady(false);
			} else if (enemyRef.current && updateUserData.login === enemyRef.current.login && updateUserData.status === ApiUserStatus.Accepted) {
				setEnemyIsReady(true);
			}
		};

		const enemyHandler = (e: string) => {
			enemyRef.current = JSON.parse(e);
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

	}, [currentUser, socket, enemyRef, gameSettingsRef, onlineUsersRef, onlineUsers, dispatch, status]);

	if (!isDesktop)
		return (
			<div style={ { fontSize: '2em', marginTop: '100px' } }>
				Window is too small :(
			</div>
		);

	const sockId = socketId ? socketId : socket.id;

	return (
		<Switch>

			<Route exact path='/login'>
				{
					sockId
						?	<Login
								socketId={ sockId }
							/>
						:	<div>
								<div>[TMP] no socket id</div>
								<div>{ `socketId: ${ socketId }` }</div>
								<div>{ `socket.id: ${ socket.id }` }</div>
							</div>
				}
			</Route>

			<Route exact path='/register'>
				<Register/>
			</Route>

			<Route exact path='/game'>
				<Game
					enemyInfo={ enemyRef.current }
					gameSettingsRef={ gameSettingsRef }
					gameRef={ gameRef }
				/>
			</Route>

			<Route path='/games/:login'>
				<GamesHistory/>
			</Route>

			<Route path='/users/:login'>
				<UserProfile/>
			</Route>

			<Route exact path='/'>
				<Main
					enemyRef={ enemyRef }
					enemyIsReady={ enemyIsReady }
				/>
			</Route>

		</Switch>
	);
};

export default App;
