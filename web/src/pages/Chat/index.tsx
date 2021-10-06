import './styles.scss'

import React from 'react';
import { useHistory } from "react-router-dom";

import { User } from "../../classes/User";
import Header from "../../components/Header";

interface ChatProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
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
