import './App.scss';

import { GameSettings, UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Chat";
import Game from "pages/Game";
import Login from 'pages/Login';
import Main from "pages/Main";
import Register from "pages/Register";
import React from 'react';
import { useMediaQuery } from "react-responsive";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
	const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

	const [status, setStatus] = React.useState<UserStatus>(UserStatus.Regular);
	const enemyRef = React.useRef<UpdateUser | null>(null);
	const gameSettingsRef = React.useRef<GameSettings | null>(null);
	const eventSourceRef = React.useRef<EventSource | null>(null);
	const [currentUser, setCurrentUser] =  React.useState(new User());
	// const user = new User();
	// user.username = 'admin';
	// const [currentUser, setCurrentUser] =  React.useState(user);

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
						gameSettingsRef={gameSettingsRef}
						eventSourceRef={eventSourceRef}
					/>
				</Route>

				<Route exact path='/'>
					<Main
						currentUser={currentUser}
						status={status}
						setStatus={setStatus}
						enemyRef={enemyRef}
						gameSettingsRef={gameSettingsRef}
						eventSourceRef={eventSourceRef}
					/>
				</Route>

			</Switch>
		</Router>
	);
};

export default App;
