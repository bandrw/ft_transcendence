import './styles.scss';

import { SocketContext } from 'context/socket';
import { useAppSelector } from 'hook/reduxHooks';
import { ApiChannelExpand, ApiChatExpand, ApiUserExpand } from 'models/ApiTypes';
import CreateChannel from 'pages/Main/Messenger/Chat/CreateChannel';
import CreateChat from 'pages/Main/Messenger/Chat/CreateChat';
import React from 'react';

import ChannelSettings from "./ChannelSettings";
import ChannelView from "./ChannelView";
import PersonalChatView from "./PersonalChatView";

export interface ISendMessage {
	message: string;
}

interface ChatProps {
	selectedChat: ApiChatExpand | null;
	selectedChannel: ApiChannelExpand | null;
	closeSelectedChat: () => void;
	chatState: string;
	setDefaultChatState: () => void;
	setSettingsChatState: () => void;
	chats: ApiChatExpand[];
	channels: ApiChannelExpand[];
}

const Chat = ({
	selectedChat,
	selectedChannel,
	closeSelectedChat,
	chatState,
	setDefaultChatState,
	setSettingsChatState,
	chats,
	channels,
}: ChatProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const socket = React.useContext(SocketContext);
	const chatsToCreate: ApiUserExpand[] = allUsers.filter(
		(usr) =>
			!chats.find((chat) => chat.userOne.id === usr.id || chat.userTwo.id === usr.id) &&
			usr.id !== currentUser.id,
	);
	const [duelStatus, setDuelStatus] = React.useState<string>('green');
	const [localDuelStatus, setLocalDuelStatus] = React.useState<string>('green');

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

		if (chatMessages.length > 0) {
			chatMessages[0].scrollTop = chatMessages[0].scrollHeight;
		}
	});

	if (chatState === 'newChat')
		return (
			<CreateChat setDefaultChatState={setDefaultChatState} chatsToCreate={chatsToCreate} allUsers={allUsers} />
		);

	if (chatState === 'newChannel') {
		return (
			<CreateChannel setDefaultChatState={setDefaultChatState} />
		);
	}

	if (chatState === 'settings' && selectedChannel) {
		return (
			<ChannelSettings
				selectedChannel={selectedChannel}
				closeSelectedChat={closeSelectedChat}
				setDefaultChatState={setDefaultChatState}
			/>
		);
	}

	if (selectedChat) {
		return (
			<PersonalChatView
				selectedChat={selectedChat}
				duelStatus={duelStatus}
				localDuelStatus={localDuelStatus}
				setLocalDuelStatus={setLocalDuelStatus}
				closeSelectedChat={closeSelectedChat}
			/>
		);
	}

	if (selectedChannel) {
		return (
			<ChannelView
				selectedChannel={selectedChannel}
				closeSelectedChat={closeSelectedChat}
				setSettingsChatState={setSettingsChatState}
			/>
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
