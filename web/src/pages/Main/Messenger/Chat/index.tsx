import './styles.scss';

import { faBullhorn, faLock, faPaperPlane, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "app/token";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiChannelExpand, ApiChatExpand, ApiMessage, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import CreateChannel from "pages/Main/Messenger/Chat/CreateChannel";
import CreateChat from "pages/Main/Messenger/Chat/CreateChat";
import Message from "pages/Main/Messenger/Chat/Message";
import React  from "react";
import { Link } from 'react-router-dom';

interface ChatProps {
	currentUser: User,
	selectedChat: ApiChatExpand | null,
	selectedChannel: ApiChannelExpand | null,
	closeSelectedChat: () => void,
	messages: ApiMessage[],
	chatState: string,
	setDefaultChatState: () => void,
	allUsers: ApiUserExpand[],
	chats: ApiChatExpand[],
	channels: ApiChannelExpand[]
}

const Chat = ({ currentUser, selectedChat, selectedChannel, closeSelectedChat,
								messages, chatState, setDefaultChatState, allUsers, chats, channels }: ChatProps) => {
	const socket = React.useContext(SocketContext);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [joinPassword, setJoinPassword] = React.useState('');
	const chatsToCreate: ApiUserExpand[] = allUsers.filter(usr =>
		!chats.find(chat => chat.userOne.id === usr.id || chat.userTwo.id === usr.id) && usr.id !== currentUser.id
	);
	const [joinError, setJoinError] = React.useState<string>('');

	const sendMsg = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputRef.current)
			return ;

		const text = inputRef.current.value.trim();
		if (text.length === 0)
			return ;

		if (selectedChat) {
			const data = {
				text: text,
				chatId: selectedChat.id
			};
			socket.emit('sendMessage', JSON.stringify(data));
			inputRef.current.value = '';
		}

		if (selectedChannel) {
			const data = {
				text: text,
				channelId: selectedChannel.id
			};
			socket.emit('sendMessage', JSON.stringify(data));
			inputRef.current.value = '';
		}
	};

	if (chatState === 'newChat')
		return (
			<CreateChat
				setDefaultChatState={ setDefaultChatState }
				chatsToCreate={ chatsToCreate }
				allUsers={ allUsers }
			/>
		);

	if (chatState === 'newChannel')
		return (
			<CreateChannel
				setDefaultChatState={ setDefaultChatState }
			/>
		);

	setTimeout(() => {
		const chatMessages = document.getElementsByClassName('messenger-chat-messages');
		if (chatMessages.length > 0)
			chatMessages[0].scrollTop = chatMessages[0].scrollHeight;
	}, 0);

	if (selectedChat) {
		const companion = selectedChat.userOne?.login === currentUser.username ? selectedChat.userTwo : selectedChat.userOne;

		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-info'>
					<Link className='messenger-chat-info-companion' to={ `/users/${companion.login}` }>
						<div className='messenger-chat-info-img' style={ { backgroundImage: `url(${companion.url_avatar})` } }/>
						<div>{ companion.login }</div>
					</Link>
					<button
						className='messenger-chat-info-play-btn'
						onClick={ () => {
						} }
					>
						<span className='messenger-chat-info-play-btn-text'>Play pong</span>
						<span className='messenger-chat-info-play-btn-img'>
							<FontAwesomeIcon icon={ faPlay }/>
						</span>
					</button>
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
						messages.map((msg, i) =>
							<Message
								key={ i }
								message={ msg }
								isFromCompanion={ msg.fromUserId !== currentUser.id }
							/>
						)
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
	}

	if (selectedChannel) {
		const isMember = selectedChannel.members.find(member => member.id === currentUser.id);

		if (selectedChannel.isPrivate && !isMember)
			return (
				<div className='messenger-chat'>
					<div className='messenger-chat-info'>
						<div className='messenger-chat-info-img'>
							<FontAwesomeIcon icon={ faBullhorn }/>
						</div>
						<div className='messenger-chat-info-name'>
							<div className='messenger-chat-info-title'>{ selectedChannel.title }</div>
							<div className='messenger-chat-info-members'>{ `${selectedChannel.members.length} ${selectedChannel.members.length > 1 ? 'members' : 'member'}` }</div>
						</div>
						<button
							className='messenger-chat-close-btn'
							onClick={ closeSelectedChat }
							title='Close'
						>
							<FontAwesomeIcon icon={ faTimes }/>
						</button>
					</div>
					<form
						onSubmit={ (e) => {
							e.preventDefault();

							axios.post('/channels/join', { channelId: selectedChannel.id, password: joinPassword }, {
								headers: { Authorization: `Bearer ${getToken()}` }
							}).catch(() => setJoinError('Wrong password'));
						} }
						className='messenger-chat-join-private-form'
					>
						<div className='messenger-chat-join-private-form-top'>
							<FontAwesomeIcon icon={ faLock }/>
							<span>Channel is private</span>
						</div>
						<input
							onChange={ (e) => setJoinPassword(e.target.value) }
							type='password'
							name='private_channel_password'
							placeholder='Password'
						/>
						<div className='messenger-chat-join-private-errors'>{ joinError }</div>
						<button disabled={ joinPassword.length === 0 } type='submit'>Join</button>
					</form>
				</div>
			);

		return (
			<div className='messenger-chat'>
				<div className='messenger-chat-info'>
					<div className='messenger-chat-info-img'>
						<FontAwesomeIcon icon={ faBullhorn }/>
					</div>
					<div className='messenger-chat-info-name'>
						<div className='messenger-chat-info-title'>{ selectedChannel.title }</div>
						<div className='messenger-chat-info-members'>{ `${selectedChannel.members.length} ${selectedChannel.members.length > 1 ? 'members' : 'member'}` }</div>
					</div>
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
						selectedChannel.messages.map((msg, i) => {
							const author = allUsers.find(usr => usr.id === msg.fromUserId);

							return (
								<Message
									key={ i }
									message={ msg }
									isFromCompanion={ msg.fromUserId !== currentUser.id }
									author={ author ? { name: author.login, imageUrl: author.url_avatar } : undefined }
								/>
							);
						})
					}
				</div>
				{
					isMember
						?	<form className='messenger-chat-form' onSubmit={ sendMsg }>
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
						:	<button
							className='messenger-chat-join-btn'
							onClick={ () => {
								axios.post('/channels/join', { channelId: selectedChannel.id }, {
									headers: { Authorization: `Bearer ${getToken()}` }
								}).then(() => {});
							} }
						>
							Join
						</button>
				}
			</div>
		);
	}

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
};

export default Chat;
