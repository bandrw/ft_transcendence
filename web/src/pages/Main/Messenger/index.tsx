import './styles.scss';

import axios from "axios";
import { ApiChatExpand } from "models/apiTypes";
import { User } from "models/User";
import Contact from "pages/Main/Messenger/Contact";
import React from "react";

import Chat from "./Chat";

interface MessengerProps {
	currentUser: User
}

const Messenger = ({ currentUser }: MessengerProps) => {
	const [chats, setChats] = React.useState<ApiChatExpand[]>([]);
	const [selectedChat, setSelectedChat] = React.useState<ApiChatExpand | null>(null);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiChatExpand[]>('/chat', { params: { userId: 1, expand: true } })
			.then(res => {
				if (!isMounted)
					return ;

				setChats(res.data);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	// const tmpChats = [];
	// for (let i in chats)
	// 	for (let j = 0; j < 20; ++j)
	// 		tmpChats.push(chats[i]);

	return (
		<div className='main-block messenger'>
			<div className='main-block-title'>
				<span>Messenger</span>
			</div>
			<div className='messenger-container'>
				<div className='messenger-contacts'>
					{
						chats.map((chat, i) => {
							const companion = chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne;

							return (
								<Contact
									key={ i }
									image={ companion.url_avatar }
									username={ companion.login }
									selectedChat={ selectedChat }
									setSelectedChat={ setSelectedChat }
									chat={ chat }
								/>
							);
						})
					}
				</div>
				<Chat
					currentUser={ currentUser }
					selectedChat={ selectedChat }
					setSelectedChat={ setSelectedChat }
				/>
			</div>
		</div>
	);
};

export default Messenger;
