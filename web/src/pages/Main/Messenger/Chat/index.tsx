import './styles.scss';

import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiChatExpand, ApiMessage, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import Message from "pages/Main/Messenger/Chat/Message";
import React from "react";

interface ChatProps {
	currentUser: User,
	selectedChat: ApiChatExpand | null,
	closeSelectedChat: () => void,
	messages: ApiMessage[],
	chatState: string,
	setDefaultChatState: () => void,
	allUsers: ApiUserExpand[],
	chats: ApiChatExpand[]
}

const Chat = ({ currentUser, selectedChat, closeSelectedChat, messages, chatState, setDefaultChatState, allUsers, chats }: ChatProps) => {
	const socket = React.useContext(SocketContext);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const companion = selectedChat?.userOne?.login === currentUser.username ? selectedChat?.userTwo : selectedChat?.userOne;
	const chatsToCreate: ApiUserExpand[] = allUsers.filter(usr =>
		!chats.find(chat => chat.userOne.id === usr.id || chat.userTwo.id === usr.id) && usr.id !== currentUser.id
	);

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

	if (chatState === 'newChat')
		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-info'>
					<div>
						Create a new chat
					</div>
					<button
						className='messenger-chat-close-btn'
						onClick={ setDefaultChatState }
						title='Close'
					>
						<FontAwesomeIcon icon={ faTimes }/>
					</button>
				</div>
				<div className='messenger-create-chat'>
					<p>Select a user</p>
					{
						allUsers
							.filter(usr => chatsToCreate.find(u => usr.login === u.login))
							.map((usr, i) =>
								<div
									className='messenger-create-chat-user'
									key={ i }
									onClick={ () => {
										const data = {
											userOneId: currentUser.id,
											userTwoId: usr.id
										};
										axios.post('/chat/create', data)
											.then(() => setDefaultChatState());
									} }
								>
									<div className='messenger-create-chat-user-img' style={ { backgroundImage: `url(${usr.url_avatar})` } }/>
									<div className='messenger-create-chat-user-login'>
										{ usr.login }
									</div>
								</div>
							)
					}
				</div>
			</div>
		);

	if (!selectedChat)
		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-empty-msg'>
					{
						chats.length === 0
							? 'Create a chat'
							: 'Select a chat'
					}
				</div>
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
