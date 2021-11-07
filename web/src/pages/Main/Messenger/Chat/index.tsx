import './styles.scss';

import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiChatExpand } from "models/apiTypes";
import { User } from "models/User";
import React from "react";

interface ChatProps {
	currentUser: User,
	selectedChat: ApiChatExpand | null,
	setSelectedChat: React.Dispatch<React.SetStateAction<ApiChatExpand | null>>
}

const Chat = ({ currentUser, selectedChat, setSelectedChat }: ChatProps) => {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const companion = selectedChat?.userOne?.login === currentUser.username ? selectedChat?.userTwo : selectedChat?.userOne;

	const sendMsg = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputRef.current) {
			console.log('sending msg', inputRef.current?.value);
			inputRef.current.value = '';
		}
	};

	if (!selectedChat)
		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-empty-msg'>Select a chat</div>
			</div>
		);

	return (
		<div className='messenger-chat'>
			<div className='messenger-chat-info'>
				<div className='messenger-chat-info-img' style={ { backgroundImage: `url(${companion?.url_avatar})` } }/>
				<div>{ companion?.login }</div>
				<button
					className='messenger-chat-close-btn' 
					onClick={ () => setSelectedChat(null) }
					title='Close'
				>
					<FontAwesomeIcon icon={ faTimes }/>
				</button>
			</div>
			<div className='messenger-chat-messages'>Messages</div>
			<form className='messenger-chat-form' onSubmit={ sendMsg }>
				<input
					className='messenger-chat-input'
					ref={ inputRef }
					type='text'
					placeholder='Write a message'
				/>
				<button type='submit' className='messenger-chat-send-btn'>
					<FontAwesomeIcon icon={ faPaperPlane }/>
				</button>
			</form>
		</div>
	);
};

export default Chat;
