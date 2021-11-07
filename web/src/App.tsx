import './App.scss';

import axios from "axios";
import { ApiGameSettings, ApiUpdateUser, ApiUserExpand, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import Game from "pages/Game";
import GamesHistory from "pages/GamesHistory";
import Login from 'pages/Login';
import Main from "pages/Main";
import Register from "pages/Register";
import UserProfile from "pages/UserProfile";
import React from 'react';
import { useMediaQuery } from "react-responsive";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const [status, setStatus] = React.useState<ApiUserStatus>(ApiUserStatus.Regular);
	const enemyRef = React.useRef<ApiUpdateUser | null>(null);
	const gameSettingsRef = React.useRef<ApiGameSettings | null>(null);
	const gameRef = React.useRef<{ runs: boolean, interval: null | NodeJS.Timeout }>({ runs: false, interval: null });
	const [currentUser, setCurrentUser] =  React.useState<User>(new User());
	const [onlineUsers, setOnlineUsers] = React.useState<ApiUpdateUser[]>([]);
	const onlineUsersRef = React.useRef<ApiUpdateUser[]>([]);
	const [allUsers, setAllUsers] = React.useState<ApiUserExpand[]>([]);

	React.useEffect(() => {
		onlineUsersRef.current = onlineUsers;
	}, [onlineUsers, onlineUsersRef]);

	React.useEffect(() => {
		setAllUsers(prev => prev.map(allUser => {
			const onlineUsr = onlineUsers.find(usr => allUser.id === usr.id);
			if (!onlineUsr)
				return allUser;

			return {
				id: allUser.id,
				login: allUser.login,
				password: allUser.password,
				url_avatar: allUser.url_avatar,
				intraLogin: allUser.intraLogin,
				wonGames: allUser.wonGames,
				lostGames: allUser.lostGames,
				subscriptions: onlineUsr.subscriptions,
				subscribers: onlineUsr.subscribers,
			};
		}));
	}, [onlineUsers]);

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiUpdateUser[]>('/users/online')
			.then(res => {
				if (!isMounted)
					return ;
				setOnlineUsers(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser, setOnlineUsers]);

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiUserExpand[]>('/users', { params: { expand: true } })
			.then(res => {
				if (!isMounted)
					return ;

				setAllUsers(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser]);

	if (!isDesktop)
		return (
			<div style={ { fontSize: '2em', marginTop: '100px' } }>
				Window is too small :(
			</div>
		);

	return (
		<Router>
			<Switch>

				<Route exact path='/login'>
					<Login
						currentUser={ currentUser }
						setCurrentUser={ setCurrentUser }
					/>
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
						// eventSourceRef={ eventSourceRef }
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
		</Router>
	);
};

export default App;
