import './App.scss';

import axios from "axios";
import { ApiFetchedUser, ApiGameSettings, ApiUpdateUser, ApiUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Chat";
import Game from "pages/Game";
import Login from 'pages/Login';
import Main from "pages/Main";
import Register from "pages/Register";
import React from 'react';
import { useMediaQuery } from "react-responsive";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import GamesHistory from "./pages/GamesHistory";

const App = () => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const [status, setStatus] = React.useState<ApiUserStatus>(ApiUserStatus.Regular);
	const enemyRef = React.useRef<ApiUpdateUser | null>(null);
	const gameSettingsRef = React.useRef<ApiGameSettings | null>(null);
	const eventSourceRef = React.useRef<EventSource | null>(null);
	const gameRef = React.useRef<{ runs: boolean, interval: null | NodeJS.Timeout }>({ runs: false, interval: null });
	const mainEventSourceInitializedRef = React.useRef<boolean>(false);
	const [currentUser, setCurrentUser] =  React.useState<User>(new User());
	const [users, setUsers] = React.useState<ApiFetchedUser[]>([]);
	const usersRef = React.useRef<ApiFetchedUser[]>([]);

	React.useEffect(() => {
		usersRef.current = users;
	}, [users, usersRef]);

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<ApiUser[]>('/users/')
			.then(res => {
				if (!isMounted)
					return ;

				const fetchedUsers = res.data.map((usr: ApiUser) => {
					return {
						id: usr.id,
						login: usr.login,
						url_avatar: usr.url_avatar,
						status: ApiUserStatus.Regular,
					};
				});
				setUsers(fetchedUsers);
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
			<div style={{ fontSize: '2em', marginTop: '100px' }}>
				Window is too small :(
			</div>
		);

	return (
		<Router>
			<Switch>

				<Route exact path='/login'>
					<Login
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
					/>
				</Route>

				<Route exact path='/register'>
					<Register
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
					/>
				</Route>

				<Route exact path='/chat'>
					<Chat
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						status={status}
					/>
				</Route>

				<Route exact path='/game'>
					<Game
						enemyInfo={enemyRef.current}
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						gameSettingsRef={gameSettingsRef}
						eventSourceRef={eventSourceRef}
						gameRef={gameRef}
						setStatus={setStatus}
					/>
				</Route>

				<Route path='/games/:login'>
					<GamesHistory
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						status={status}
						users={users}
					/>
				</Route>

				<Route exact path='/'>
					<Main
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						status={status}
						setStatus={setStatus}
						enemyRef={enemyRef}
						gameSettingsRef={gameSettingsRef}
						eventSourceRef={eventSourceRef}
						mainEventSourceInitializedRef={mainEventSourceInitializedRef}
						users={users}
						setUsers={setUsers}
						usersRef={usersRef}
					/>
				</Route>

			</Switch>
		</Router>
	);
};

export default App;
