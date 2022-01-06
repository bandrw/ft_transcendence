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
	const [duelStatus, setDuelStatus] = React.useState<string>('green');
	const [localDuelStatus, setLocalDuelStatus] = React.useState<string>('green');

	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { socket } = useAppSelector((state) => state.socket);
	const {
		chats,
		channels,
		selectedChat,
		selectedChannel,
		chatState ,
	} = useAppSelector((state) => state.messenger);

	// socket events handlers
	React.useEffect(() => {
		const duelStatusHandler = (data: string) => {
			const duelStatusData: { status: string; chatId: number } = JSON.parse(data);

			if (selectedChat?.id === duelStatusData.chatId) setDuelStatus(duelStatusData.status);
		};

		socket.on('duelStatus', duelStatusHandler);

		return () => {
			socket.off('duelStatus', duelStatusHandler);

			if (selectedChat) {
				const companion = selectedChat.userOne?.login === currentUser.username ?
					selectedChat.userTwo : selectedChat.userOne;

				if (localDuelStatus === 'yellow')
					socket.emit('cancelDuel', JSON.stringify({ enemyId: companion.id, chatId: selectedChat.id }));
				setDuelStatus('green');
			}
		};
	}, [currentUser.username, localDuelStatus, selectedChat, socket]);

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
			<PersonalChatView
				selectedChat={selectedChat}
				duelStatus={duelStatus}
				localDuelStatus={localDuelStatus}
				setLocalDuelStatus={setLocalDuelStatus}
			/>
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
