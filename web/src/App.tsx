import './App.scss';

import { UserStatus } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Chat";
import Login from 'pages/Login';
import Main from "pages/Main";
import Register from "pages/Register";
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
	const [status, setStatus] = React.useState<UserStatus>(UserStatus.Regular);

	const [currentUser, setCurrentUser] =  React.useState(new User());
	// const user = new User();
	// user.username = 'admin';
	// const [currentUser, setCurrentUser] =  React.useState(user);

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

				<Route exact path='/'>
					<Main
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
						status={status}
						setStatus={setStatus}
					/>
				</Route>

			</Switch>
		</Router>
	);
};

export default App;
