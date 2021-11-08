import './styles.scss';

import { ApiChatExpand } from "models/apiTypes";
import React from "react";

interface ContactProps {
	username: string,
	image: string,
	selectedChat: ApiChatExpand | null,
	chat: ApiChatExpand,
	selectContact: () => void
}

const Contact = ({ username, image, selectedChat, chat, selectContact }: ContactProps) => {

	return (
		<div className={ `messenger-contact ${chat === selectedChat ? 'messenger-contact-selected' : ''}` } onMouseDown={ selectContact }>
			<div className='messenger-contact-image' style={ { backgroundImage: `url(${image})` } }/>
			<div className='messenger-contact-name'>{ username }</div>
		</div>
	);
};

export default Contact;
