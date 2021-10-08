import './App.scss';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { User } from "./classes/User";
import Chat from "./pages/Chat";
import Login from './pages/Login'
import Main from "./pages/Main";
import Register from "./pages/Register";

const App = () => {
	const [currentUser, setCurrentUser] =  React.useState(new User())

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
					/>
				</Route>

				<Route exact path='/'>
					<Main
						currentUser={currentUser}
						setCurrentUser={setCurrentUser}
					/>
				</Route>

			</Switch>
		</Router>
	);
}

export default App;
