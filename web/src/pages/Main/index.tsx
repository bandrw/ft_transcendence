import './styles.scss'

import React from 'react';
import { useHistory } from "react-router-dom";

import { User } from "../../classes/User";
import Game from "../../components/Game";
import Header from "../../components/Header";

interface MainProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
}

const Main = (props: MainProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!props.currentUser.isAuthorized())
			history.push('/login')
	}, [history, props.currentUser])

	return (
		<div className='main-container'>
			<Header currentUser={props.currentUser} setCurrentUser={props.setCurrentUser} />
			<div className='main-tmp'>
				<Game currentUser={props.currentUser} setCurrentUser={props.setCurrentUser}/>
			</div>
		</div>
	)
}

export default Main;
