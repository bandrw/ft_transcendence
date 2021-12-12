import './styles.scss';

import { faBullhorn, faComment, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/hooks';
import { getToken } from 'app/token';
import axios from 'axios';
import { SocketContext } from 'context/socket';
import { ApiChannelExpand, ApiChatExpand, ApiMessage, ApiUserExpand } from 'models/ApiTypes';
import Chat from 'pages/Main/Messenger/Chat';
import LeftMenuChannel from 'pages/Main/Messenger/LeftMenuChannel';
import LeftMenuChat from 'pages/Main/Messenger/LeftMenuChat';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const Messenger = () => {
	const socket = React.useContext(SocketContext);
	const [chats, setChats] = React.useState<ApiChatExpand[]>([]);
	const [channels, setChannels] = React.useState<ApiChannelExpand[]>([]);
	const [selectedChat, setSelectedChat] = React.useState<ApiChatExpand | null>(null);
	const [selectedChannel, setSelectedChannel] = React.useState<ApiChannelExpand | null>(null);
	const [showCreateMenu, setShowCreateMenu] = React.useState(false);
	const [chatState, setChatState] = React.useState('default');
	const [allChannels, setAllChannels] = React.useState<ApiChannelExpand[]>([]);
	const [searchPattern, setSearchPattern] = React.useState('');
	const { currentUser } = useAppSelector((state) => state.currentUser);

	// Fetching user's chats and channels
	React.useEffect(() => {
		let isMounted = true;

		axios
			.get<ApiChatExpand[]>('/chats', {
				params: { expand: '' },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((res) => {
				if (!isMounted) return;

				setChats(res.data);
			});

		axios
			.get<ApiUserExpand>('/users', {
				params: { login: currentUser.username, expand: '' },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((res) => {
				if (!isMounted) return;

				setChannels(res.data.channels);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser.id, currentUser.username]);

	// Events handlers
	React.useEffect(() => {
		const receiveMessageHandler = (data: string): void => {
			const msg: ApiMessage = JSON.parse(data);

			if (msg.chatId) {
				setSelectedChat((prev) => {
					const cpy: ApiChatExpand | null = JSON.parse(JSON.stringify(prev));

					if (cpy && !cpy.messages.find((m) => m.id === msg.id)) {
						cpy.messages = cpy.messages.concat(msg);
					}

					return cpy;
				});

				setChats((prev) => {
					const out: ApiChatExpand[] = [];
					for (const chat of prev) {
						const cpy: ApiChatExpand = JSON.parse(JSON.stringify(chat));

						if (chat.id === msg.chatId) {
							cpy.messages = cpy.messages.concat(msg);
						}
						out.push(cpy);
					}

					return out;
				});
			} else if (msg.channelId) {
				setAllChannels((prev) => {
					const cpy: ApiChannelExpand[] = JSON.parse(JSON.stringify(prev));
					const ch = cpy.find((channel) => channel.id === msg.channelId);

					if (ch) ch.messages = [...ch.messages, msg];

					return cpy;
				});
			}
		};

		const newChatHandler = () => {
			axios
				.get<ApiChatExpand[]>('/chats', {
					params: { expand: '' },
					headers: { Authorization: `Bearer ${getToken()}` },
				})
				.then((res) => setChats(res.data));
			axios
				.get<ApiUserExpand>('/users', {
					params: { login: currentUser.username, expand: '' },
					headers: { Authorization: `Bearer ${getToken()}` },
				})
				.then((res) => setChannels(res.data.channels));
		};

		const newChannelHandler = (data: string) => {
			const newChannel: ApiChannelExpand = JSON.parse(data);
			setAllChannels((prev) => [...prev, newChannel]);
		};

		const updateChannelHandler = () => {
			axios
				.get<ApiChannelExpand[]>('/channels', {
					params: { expand: '' },
					headers: { Authorization: `Bearer ${getToken()}` },
				})
				.then((res) => setAllChannels(res.data));
			axios
				.get<ApiUserExpand>('/users', {
					params: { login: currentUser.username, expand: '' },
					headers: { Authorization: `Bearer ${getToken()}` },
				})
				.then((res) => setChannels(res.data.channels));
		};

		socket.on('receiveMessage', receiveMessageHandler);
		socket.on('newChat', newChatHandler);
		socket.on('newChannel', newChannelHandler);
		socket.on('updateChannel', updateChannelHandler);

		return () => {
			socket.off('receiveMessage', receiveMessageHandler);
			socket.off('newChat', newChatHandler);
			socket.off('newChannel', newChannelHandler);
			socket.off('updateChannel', updateChannelHandler);
		};
	}, [currentUser.id, currentUser.username, socket]);

	// Fetching all channels
	React.useEffect(() => {
		let isMounted = true;

		axios
			.get<ApiChannelExpand[]>('/channels', {
				params: { expand: '' },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((res) => {
				if (!isMounted) return;

				setAllChannels(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	// Updating selectedChat
	React.useEffect(() => {
		if (!selectedChat) return;

		const chat = chats.find((ch) => ch.id === selectedChat.id);

		if (chat) setSelectedChat(chat);
	}, [chats, selectedChat]);

	// Updating selectedChannel
	React.useEffect(() => {
		if (!selectedChannel) return;

		const channel = allChannels.find((ch) => ch.id === selectedChannel.id);

		if (channel) setSelectedChannel(channel);
	}, [allChannels, selectedChannel]);

	const matchedChannels: ApiChannelExpand[] = allChannels.filter(
		(channel) =>
			searchPattern.length !== 0 &&
			!channels.find((ch) => ch.id === channel.id) &&
			(channel.name.trim().toLowerCase().includes(searchPattern.trim().toLowerCase()) ||
				channel.title.trim().toLowerCase().includes(searchPattern.trim().toLowerCase())),
	);

	return (
		<div className="main-block messenger">
			<div className="main-block-title">
				<span>Messenger</span>
			</div>
			<div className="messenger-container">
				<div className="messenger-contacts">
					<div className="messenger-contacts-header">
						<input
							type="text"
							placeholder="Search"
							className="messenger-contacts-header-search"
							onChange={(e) => setSearchPattern(e.target.value)}
						/>
						<button
							className={`messenger-contacts-header-btn ${
								showCreateMenu ? 'messenger-contacts-header-btn-active' : ''
							}`}
							onClick={() => setShowCreateMenu((prev) => !prev)}
						>
							<FontAwesomeIcon icon={faPlus} />
							{showCreateMenu && (
								<Fade duration={300}>
									<div
										className="messenger-contacts-header-menu-wrapper"
										onMouseLeave={() => setShowCreateMenu(false)}
									>
										<div className="messenger-contacts-header-menu">
											<div
												className="messenger-contacts-header-menu-btn"
												onClick={() => setChatState('newChat')}
											>
												<FontAwesomeIcon icon={faComment} />
												New Chat
											</div>
											<div
												className="messenger-contacts-header-menu-btn"
												onClick={() => setChatState('newChannel')}
											>
												<FontAwesomeIcon icon={faBullhorn} />
												New Channel
											</div>
										</div>
									</div>
								</Fade>
							)}
						</button>
					</div>
					<div className="messenger-contacts-scroll">
						{chats
							.filter((chat) => {
								const companion =
									chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne;

								return companion.login
									.trim()
									.toLowerCase()
									.includes(searchPattern.trim().toLowerCase());
							})
							.map((chat, i) => {
								const companion =
									chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne;

								return (
									<LeftMenuChat
										key={chat.id}
										image={companion.url_avatar}
										title={companion.login}
										isSelected={chat.id === selectedChat?.id}
										selectChat={() => {
											setSelectedChat(chat);
											setSelectedChannel(null);
											setChatState('default');
										}}
									/>
								);
							})}
						{channels
							.filter(
								(channel) =>
									channel.name.trim().toLowerCase().includes(searchPattern.trim().toLowerCase()) ||
									channel.title.trim().toLowerCase().includes(searchPattern.trim().toLowerCase()),
							)
							.map((channel, i) => (
								<LeftMenuChannel
									key={channel.id}
									title={channel.title}
									isSelected={selectedChannel?.id === channel.id}
									selectChannel={() => {
										setSelectedChannel(channel);
										setSelectedChat(null);
										setChatState('default');
									}}
									isPrivate={channel.isPrivate}
								/>
							))}
						{searchPattern && <div className="messenger-contacts-search-scope">global search</div>}
						{matchedChannels.map((channel, i) => (
							<LeftMenuChannel
								key={channel.id}
								title={channel.title}
								isSelected={selectedChannel?.id === channel.id}
								selectChannel={() => {
									setSelectedChannel(channel);
									setSelectedChat(null);
									setChatState('default');
								}}
								isPrivate={channel.isPrivate}
							/>
						))}
						{chats.length + channels.length === 0 && (
							<div className="messenger-contacts-empty-msg">You have no chats yet</div>
						)}
					</div>
				</div>
				<Chat
					selectedChat={selectedChat}
					selectedChannel={selectedChannel}
					closeSelectedChat={() => {
						setSelectedChat(null);
						setSelectedChannel(null);
					}}
					messages={selectedChat?.messages || []}
					chatState={chatState}
					setDefaultChatState={() => {
						setChatState('default');
						setSelectedChat(null);
					}}
					setSettingsChatState={() => setChatState('settings')}
					chats={chats}
					channels={channels}
				/>
			</div>
		</div>
	);
};

export default Messenger;
