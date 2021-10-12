import './styles.scss'

import React from 'react';
import { useHistory } from "react-router-dom";

// import Game from "../../components/Game";
import Header from "../../components/Header";
import { User } from "../../models/User";
import FindGame from "./FindGame";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >
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
			<FindGame currentUser={props.currentUser} />
			{/*<div className='main-tmp'>*/}
			{/*	<Game*/}
			{/*		currentUser={props.currentUser}*/}
			{/*		setCurrentUser={props.setCurrentUser}*/}
			{/*	/>*/}
			{/*</div>*/}
		</div>
	)
}

export default Main;
