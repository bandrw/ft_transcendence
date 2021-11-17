import './styles.scss';

import { faBullhorn, faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiChannelExpand, ApiChatExpand, ApiMessage, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Main/Messenger/Chat";
import LeftMenuChannel from "pages/Main/Messenger/LeftMenuChannel";
import LeftMenuChat from "pages/Main/Messenger/LeftMenuChat";
import React from "react";
import { Fade } from "react-awesome-reveal";

interface MessengerProps {
	currentUser: User,
	allUsers: ApiUserExpand[]
}

const Messenger = ({ currentUser, allUsers }: MessengerProps) => {
	const socket = React.useContext(SocketContext);
	const [chats, setChats] = React.useState<ApiChatExpand[]>([]);
	const [channels, setChannels] = React.useState<ApiChannelExpand[]>([]);
	const [selectedChat, setSelectedChat] = React.useState<ApiChatExpand | null>(null);
	const [selectedChannel, setSelectedChannel] = React.useState<ApiChannelExpand | null>(null);
	const [showCreateMenu, setShowCreateMenu] = React.useState(false);
	const [chatState, setChatState] = React.useState('default');

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiChatExpand[]>('/chats', {
			params: { expand: '' },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(res => {
				if (!isMounted)
					return ;

				setChats(res.data);
			});

		axios.get<ApiUserExpand>('/users', {
			params: { login: currentUser.username, expand: '' },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(res => {
				if (!isMounted)
					return ;

				setChannels(res.data.channels);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser.id, currentUser.username]);

	React.useEffect(() => {

		const receiveMessageHandler = (data: string): void => {
			const msg: ApiMessage = JSON.parse(data);

			if (msg.chatId) {
				setSelectedChat(prev => {
					const cpy: ApiChatExpand | null = JSON.parse(JSON.stringify(prev));
					if (cpy && !cpy.messages.find(m => m.id === msg.id))
						cpy.messages = cpy.messages.concat(msg);
					return cpy;
				});

				setChats(prev => {
					const out: ApiChatExpand[] = [];
					for (let i in prev) {
						const cpy: ApiChatExpand = JSON.parse(JSON.stringify(prev[i]));
						if (prev[i].id === msg.chatId) {
							cpy.messages = cpy.messages.concat(msg);
						}
						out.push(cpy);
					}
					return out;
				});
			} else if (msg.channelId) {
				setSelectedChannel(prev => {
					const cpy: ApiChannelExpand | null = JSON.parse(JSON.stringify(prev));
					if (cpy && !cpy.messages.find(m => m.id === msg.id))
						cpy.messages = cpy.messages.concat(msg);
					return cpy;
				});
			}
		};

		const newChatHandler = (): void => {
			axios.get<ApiChatExpand[]>('/chats', {
				params: { expand: '' },
				headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
			})
				.then(res => setChats(res.data));
			axios.get<ApiUserExpand>('/users', {
				params: { login: currentUser.username, expand: '' },
				headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
			})
				.then(res => setChannels(res.data.channels));
		};

		socket.on('receiveMessage', receiveMessageHandler);
		socket.on('newChat', newChatHandler);

		return () => {
			socket.off('receiveMessage', receiveMessageHandler);
			socket.off('newChat', newChatHandler);
		};

	}, [currentUser.id, currentUser.username, socket]);

	setTimeout(() => {
		const chatMessages = document.getElementsByClassName('messenger-chat-messages');
		if (chatMessages.length > 0)
			chatMessages[0].scrollTop = chatMessages[0].scrollHeight;
	}, 0);

	return (
		<div className='main-block messenger'>
			<div className='main-block-title'>
				<span>Messenger</span>
			</div>
			<div className='messenger-container'>
				<div className='messenger-contacts'>
					<div className='messenger-contacts-header'>
						<input
							type='text'
							placeholder='Search'
							className='messenger-contacts-header-search'
						/>
						<button
							className={ `messenger-contacts-header-btn ${showCreateMenu ? 'messenger-contacts-header-btn-active' : ''}` }
							onClick={ () => setShowCreateMenu(prev => !prev) }
						>
							<FontAwesomeIcon icon={ faPlus }/>
							{
								showCreateMenu &&
									<Fade
										duration={ 300 }
									>
										<div
											className='messenger-contacts-header-menu-wrapper'
											onMouseLeave={ () => setShowCreateMenu(false) }
										>
											<div className='messenger-contacts-header-menu'>
												<div
													className='messenger-contacts-header-menu-btn'
													onClick={ () => setChatState('newChat') }
												>
													<FontAwesomeIcon icon={ faComment }/>
													New Chat
												</div>
												<div
													className='messenger-contacts-header-menu-btn'
													onClick={ () => setChatState('newChannel') }
												>
													<FontAwesomeIcon icon={ faBullhorn }/>
													New Channel
												</div>
											</div>
										</div>
									</Fade>
							}
						</button>
					</div>
					{
						chats.map((chat, i) => {
							const companion = chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne;

							return (
								<LeftMenuChat
									key={ i }
									image={ companion.url_avatar }
									title={ companion.login }
									isSelected={ chat.id === selectedChat?.id }
									selectChat={ () => {
										setSelectedChat(chat);
										setSelectedChannel(null);
									} }
								/>
							);
						})
					}
					{
						channels.map((channel, i) => {
							return (
								<LeftMenuChannel
									key={ i }
									title={ channel.title }
									isSelected={ selectedChannel?.id === channel.id }
									selectChannel={ () => {
										setSelectedChannel(channel);
										setSelectedChat(null);
									} }
								/>
							);
						})
					}
					{
						(chats.length + channels.length) === 0 &&
						<div className='messenger-contacts-empty-msg'>You have no chats yet</div>
					}
				</div>
				<Chat
					currentUser={ currentUser }
					selectedChat={ selectedChat }
					selectedChannel={ selectedChannel }
					closeSelectedChat={ () => {
						setSelectedChat(null);
						setSelectedChannel(null);
					} }
					messages={ selectedChat?.messages || [] }
					chatState={ chatState }
					setDefaultChatState={ () => {
						setChatState('default');
						setSelectedChat(null);
					} }
					allUsers={ allUsers }
					chats={ chats }
					channels={ channels }
				/>
			</div>
		</div>
	);
};

export default Messenger;
