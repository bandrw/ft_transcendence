import './styles.scss';

import { ApiChatExpand } from "models/apiTypes";
import React from "react";

interface ContactProps {
	username: string,
	image: string,
	selectedChat: ApiChatExpand | null,
	setSelectedChat: React.Dispatch<React.SetStateAction<ApiChatExpand | null>>,
	chat: ApiChatExpand
}

const Contact = ({ username, image, selectedChat, setSelectedChat, chat }: ContactProps) => {
	const selectContact = () => {
		setSelectedChat(chat);
	};

	return (
		<div className={ `messenger-contact ${chat === selectedChat ? 'messenger-contact-selected' : ''}` } onClick={ selectContact }>
			<div className='messenger-contact-image' style={ { backgroundImage: `url(${image})` } }/>
			<div className='messenger-contact-name'>{ username }</div>
		</div>
	);
};

export default Contact;
