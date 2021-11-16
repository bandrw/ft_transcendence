import './App.scss';

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
	const [status, setStatus] = React.useState<ApiUserStatus>(ApiUserStatus.Regular);
	const enemyRef = React.useRef<ApiUpdateUser | null>(null);
	const gameSettingsRef = React.useRef<ApiGameSettings | null>(null);
	const gameRef = React.useRef<{ runs: boolean, interval: null | NodeJS.Timeout }>({ runs: false, interval: null });
	const [currentUser, setCurrentUser] =  React.useState<User>(new User());
	const [onlineUsers, setOnlineUsers] = React.useState<ApiUpdateUser[]>([]);
	const onlineUsersRef = React.useRef<ApiUpdateUser[]>([]);
	const [allUsers, setAllUsers] = React.useState<ApiUserExpand[]>([]);
	const [socketId, setSocketId] = React.useState<string | null>(null);

	// Saving onlineUsers in onlineUsersRef
	React.useEffect(() => {
		onlineUsersRef.current = onlineUsers;
	}, [onlineUsers, onlineUsersRef]);

	// Updating allUsers on change in onlineUsers
	React.useEffect(() => {
		setAllUsers(prev => prev.map(allUser => {
			const onlineUsr = onlineUsers.find(usr => allUser.id === usr.id);
			if (!onlineUsr)
				return allUser;

			return {
				id: allUser.id,
				login: allUser.login,
				url_avatar: allUser.url_avatar,
				intraLogin: allUser.intraLogin,
				wonGames: allUser.wonGames,
				lostGames: allUser.lostGames,
				subscriptions: onlineUsr.subscriptions,
				subscribers: onlineUsr.subscribers,
				createdChats: allUser.createdChats,
				acceptedChats: allUser.acceptedChats,
				messages: allUser.messages,
				ownedChannels: allUser.ownedChannels,
				channels: allUser.channels
			};
		}));
	}, [onlineUsers]);

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
				setOnlineUsers(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser, setOnlineUsers]);

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

				setAllUsers(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser]);

	// Getting user from access_token
	React.useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		const sockId = socketId ? socketId : socket.id;

		if (accessToken && sockId) {
			getCurrentUser(accessToken, sockId, 'local')
				.then(usr => {
					if (usr) {
						setCurrentUser(usr);
					} else {
						localStorage.removeItem('access_token');
						setCurrentUser(new User());
					}
				});
		}

	}, [socket.id, socketId]);

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

	if (!isDesktop)
		return (
			<div style={ { fontSize: '2em', marginTop: '100px' } }>
				Window is too small :(
			</div>
		);

	return (
		<Switch>

			<Route exact path='/login'>
				{
					socketId
						?	<Login
								currentUser={ currentUser }
								setCurrentUser={ setCurrentUser }
								socketId={ socketId }
							/>
						:	'[TMP] no socket id'
				}
			</Route>

			<Route exact path='/register'>
				<Register
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
				/>
			</Route>

			<Route exact path='/game'>
				<Game
					enemyInfo={ enemyRef.current }
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					gameSettingsRef={ gameSettingsRef }
					gameRef={ gameRef }
					status={ status }
					setStatus={ setStatus }
				/>
			</Route>

			<Route path='/games/:login'>
				<GamesHistory
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
					allUsers={ allUsers }
				/>
			</Route>

			<Route path='/users/:login'>
				<UserProfile
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
					allUsers={ allUsers }
				/>
			</Route>

			<Route exact path='/'>
				<Main
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
					setStatus={ setStatus }
					enemyRef={ enemyRef }
					gameSettingsRef={ gameSettingsRef }
					allUsers={ allUsers }
					onlineUsers={ onlineUsers }
					setOnlineUsers={ setOnlineUsers }
					onlineUsersRef={ onlineUsersRef }
				/>
			</Route>

		</Switch>
	);
};

export default App;
