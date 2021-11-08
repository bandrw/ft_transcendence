import './styles.scss';

import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SocketContext } from "context/socket";
import { ApiChatExpand, ApiMessage } from "models/apiTypes";
import { User } from "models/User";
import Message from "pages/Main/Messenger/Chat/Message";
import React from "react";

interface ChatProps {
	currentUser: User,
	selectedChat: ApiChatExpand | null,
	closeSelectedChat: () => void,
	messages: ApiMessage[]
}

const Chat = ({ currentUser, selectedChat, closeSelectedChat, messages }: ChatProps) => {
	const socket = React.useContext(SocketContext);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const companion = selectedChat?.userOne?.login === currentUser.username ? selectedChat?.userTwo : selectedChat?.userOne;

	const sendMsg = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputRef.current && selectedChat) {
			const text = inputRef.current.value.trim();
			if (text.length === 0)
				return ;
			const data = {
				text: text,
				chatId: selectedChat.id
			};
			socket.emit('sendMessage', JSON.stringify(data));
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
					onClick={ closeSelectedChat }
					title='Close'
				>
					<FontAwesomeIcon icon={ faTimes }/>
				</button>
			</div>
			<div className='messenger-chat-messages'>
				{
					companion &&
					messages.map((msg, i) =>
						<Message key={ i } message={ msg } companion={ companion } />)
				}
			</div>
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
