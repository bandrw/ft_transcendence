import './App.scss';

import axios from "axios";
import { ApiGameSettings, ApiOnlineUser, ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Chat";
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
	const eventSourceRef = React.useRef<EventSource | null>(null);
	const gameRef = React.useRef<{ runs: boolean, interval: null | NodeJS.Timeout }>({ runs: false, interval: null });
	const mainEventSourceInitializedRef = React.useRef<boolean>(false);
	const [currentUser, setCurrentUser] =  React.useState<User>(new User());
	const [users, setUsers] = React.useState<ApiOnlineUser[]>([]);
	const usersRef = React.useRef<ApiOnlineUser[]>([]);

	React.useEffect(() => {
		usersRef.current = users;
	}, [users, usersRef]);

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiOnlineUser[]>('/users/online')
			.then(res => {
				if (!isMounted)
					return ;

				setUsers(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser, setUsers]);

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return ;

		eventSourceRef.current = new EventSource(`${process.env.REACT_APP_API_URL}/users/login?login=${currentUser.username}`);

		return () => {
			eventSourceRef.current?.close();
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

				<Route exact path='/chat'>
					<Chat
						currentUser={ currentUser }
						setCurrentUser={ setCurrentUser }
						status={ status }
					/>
				</Route>

				<Route exact path='/game'>
					<Game
						enemyInfo={ enemyRef.current }
						currentUser={ currentUser }
						setCurrentUser={ setCurrentUser }
						gameSettingsRef={ gameSettingsRef }
						eventSourceRef={ eventSourceRef }
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
						users={ users }
					/>
				</Route>

				<Route path='/users/:login'>
					<UserProfile
						currentUser={ currentUser }
						setCurrentUser={ setCurrentUser }
						status={ status }
						users={ users }
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
						eventSourceRef={ eventSourceRef }
						mainEventSourceInitializedRef={ mainEventSourceInitializedRef }
						users={ users }
						setUsers={ setUsers }
						usersRef={ usersRef }
					/>
				</Route>

			</Switch>
		</Router>
	);
};

export default App;
