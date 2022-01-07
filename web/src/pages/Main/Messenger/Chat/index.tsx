import './styles.scss';

import { useAppSelector } from "hook/reduxHooks";
import CreateChannel from 'pages/Main/Messenger/Chat/CreateChannel';
import CreateChat from 'pages/Main/Messenger/Chat/CreateChat';
import React from "react";

import ChannelSettings from "./ChannelSettings";
import ChannelView from "./ChannelView";
import PersonalChatView from "./PersonalChatView";

export interface ISendMessage {
	message: string;
}

const Chat = () => {
	const {
		chats,
		channels,
		selectedChat,
		selectedChannel,
		chatState ,
	} = useAppSelector((state) => state.messenger);

	// Scroll to the newest messages
	React.useEffect(() => {
		const chatMessages = document.getElementsByClassName('messenger-chat-messages');

		for (let i = 0; i < chatMessages.length; ++i) {
			chatMessages[i].scrollTop = chatMessages[i].scrollHeight;
		}
	});

	if (chatState === 'newChat')
		return (
			<CreateChat />
		);

	if (chatState === 'newChannel') {
		return (
			<CreateChannel />
		);
	}

	if (chatState === 'settings' && selectedChannel) {
		return (
			<ChannelSettings selectedChannel={selectedChannel} />
		);
	}

	if (selectedChat) {
		return (
			<PersonalChatView selectedChat={selectedChat} />
		);
	}

	if (selectedChannel) {
		return (
			<ChannelView selectedChannel={selectedChannel} />
		);
	}

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-empty-msg">
				{chats.length + channels.length === 0 ? 'Create a chat' : 'Select a chat'}
			</div>
		</div>
	);
};

export default Chat;
