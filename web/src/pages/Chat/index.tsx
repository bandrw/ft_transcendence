import './styles.scss'

import React from 'react';
import { useHistory } from "react-router-dom";

import Header from "../../components/Header";
import { User } from "../../models/User";

interface ChatProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >
}

const Chat = (props: ChatProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!props.currentUser.isAuthorized())
			history.push('/login')
	}, [history, props.currentUser])

	return (
		<div className='chat-container'>
			<Header
				currentUser={props.currentUser}
				setCurrentUser={props.setCurrentUser}
			/>
			Chat view
		</div>
	)
}

export default Chat;
