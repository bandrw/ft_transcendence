import './styles.scss';

import { faBullhorn, faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SocketContext } from "context/socket";
import { ApiChatExpand, ApiMessage } from "models/apiTypes";
import { User } from "models/User";
import Chat from "pages/Main/Messenger/Chat";
import Contact from "pages/Main/Messenger/Contact";
import React from "react";
import { Fade } from "react-awesome-reveal";

interface MessengerProps {
	currentUser: User
}

const Messenger = ({ currentUser }: MessengerProps) => {
	const socket = React.useContext(SocketContext);
	const [chats, setChats] = React.useState<ApiChatExpand[]>([]);
	const [selectedChat, setSelectedChat] = React.useState<ApiChatExpand | null>(null);
	const [showCreateMenu, setShowCreateMenu] = React.useState(false);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiChatExpand[]>('/chat', { params: { userId: currentUser.id, expand: true } })
			.then(res => {
				if (!isMounted)
					return ;

				setChats(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser.id]);

	React.useEffect(() => {

		const receiveMessageHandler = (data: string): void => {
			const msg: ApiMessage = JSON.parse(data);
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
		};

		socket.on('receiveMessage', receiveMessageHandler);

		return () => {
			socket.off('receiveMessage', receiveMessageHandler);
		};

	}, [socket]);

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
							onMouseOver={ () => setShowCreateMenu(true) }
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
													onClick={ () => {
														setShowCreateMenu(false);
														alert('todo');
													} }
												>
													<FontAwesomeIcon icon={ faComment }/>
													New Chat
												</div>
												<div
													className='messenger-contacts-header-menu-btn'
													onClick={ () => {
														setShowCreateMenu(false);
														alert('todo');
													} }
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
								<Contact
									key={ i }
									image={ companion.url_avatar }
									username={ companion.login }
									selectedChat={ selectedChat }
									selectContact={ () => setSelectedChat(chat) }
									chat={ chat }
								/>
							);
						})
					}
				</div>
				<Chat
					currentUser={ currentUser }
					selectedChat={ selectedChat }
					closeSelectedChat={ () => setSelectedChat(null) }
					messages={ selectedChat?.messages || [] }
				/>
			</div>
		</div>
	);
};

export default Messenger;
