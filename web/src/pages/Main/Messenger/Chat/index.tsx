import './styles.scss';

import { faCheck, faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiChannel, ApiChatExpand, ApiMessage, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import Message from "pages/Main/Messenger/Chat/Message";
import React, { FormEvent } from "react";

interface CreateChannelProps {
	setDefaultChatState: () => void
}

const CreateChannel = ({ setDefaultChatState }: CreateChannelProps) => {
	const [isPrivate, setIsPrivate] = React.useState(false);
	const nameRef = React.useRef<HTMLInputElement>(null);
	const titleRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const createChannelForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const name = nameRef.current?.value || '';
		const title = titleRef.current?.value || '';
		const password = passwordRef.current?.value || '';

		const data = {
			name: name,
			title: title,
			isPrivate: isPrivate,
			password: password
		};
		await axios.post('/channel/create', data, {
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		});
		setDefaultChatState();
	};

	return (
		<div className='messenger-chat'>
			<div className='messenger-chat-info'>
				<div>
					Create a new channel
				</div>
				<button
					className='messenger-chat-close-btn'
					onClick={ setDefaultChatState }
					title='Close'
				>
					<FontAwesomeIcon icon={ faTimes }/>
				</button>
			</div>
			<form className='messenger-create-channel' onSubmit={ createChannelForm }>
				<input ref={ nameRef } required={ true } type='text' placeholder='Name'/>
				<input ref={ titleRef } required={ true } type='text' placeholder='Title'/>
				<div className='messenger-create-channel-visibility'>
					<button type='button' className='is-private-checkbox' onClick={ () => setIsPrivate(false) }>
						<div className={ isPrivate ? 'visibility' : 'visibility-active' }>
							{
								!isPrivate &&
								<FontAwesomeIcon icon={ faCheck }/>
							}
						</div>
						<span>Public</span>
					</button>
					<button type='button' className='is-private-checkbox' onClick={ () => setIsPrivate(true) }>
						<div className={ isPrivate ? 'visibility-active' : 'visibility' }>
							{
								isPrivate &&
								<FontAwesomeIcon icon={ faCheck }/>
							}
						</div>
						<span>Private</span>
					</button>
				</div>
				{
					isPrivate &&
					<input ref={ passwordRef } name='password' type='password' placeholder='Password'/>
				}
				<button type='submit'>Create</button>
			</form>
		</div>
	);
};

interface ChatProps {
	currentUser: User,
	selectedChat: ApiChatExpand | null,
	closeSelectedChat: () => void,
	messages: ApiMessage[],
	chatState: string,
	setDefaultChatState: () => void,
	allUsers: ApiUserExpand[],
	chats: ApiChatExpand[],
	channels: ApiChannel[]
}

const Chat = ({ currentUser, selectedChat, closeSelectedChat, messages, chatState, setDefaultChatState, allUsers, chats, channels }: ChatProps) => {
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
										axios.post('/chat/create', data, {
											headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
										})
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

	if (chatState === 'newChannel')
		return (
			<CreateChannel
				setDefaultChatState={ setDefaultChatState }
			/>
		);

	if (!selectedChat)
		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-empty-msg'>
					{
						(chats.length + channels.length) === 0
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
