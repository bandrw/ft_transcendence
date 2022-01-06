import './styles.scss';

import { useAppDispatch, useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand, ApiChatExpand, ApiMessage } from "models/ApiTypes";
import Chat from 'pages/Main/Messenger/Chat';
import React from 'react';
import {
	addNewChannel,
	addNewChat, addNewMessage,
	getAllChannelsAction,
	getChannelsAction,
	getChatsAction, setChats,
	setSelectedChannel,
	setSelectedChat,
} from "store/reducers/messengerSlice";

import Contacts from "./Contacts";

const Messenger = () => {
	const { socket } = useAppSelector((state) => state.socket);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const {
		selectedChat,
		selectedChannel,
		chats,
		allChannels,
	} = useAppSelector((state) => state.messenger);
	const dispatch = useAppDispatch();

	// Fetching user's chats and channels
	React.useEffect(() => {
		dispatch(getChatsAction());
		dispatch(getChannelsAction(currentUser.username));
	}, [currentUser.username, dispatch]);

	// Events handlers
	React.useEffect(() => {
		const receiveMessageHandler = (data: string): void => {
			const msg: ApiMessage = JSON.parse(data);
			dispatch(addNewMessage(msg));
		};

		const newChatHandler = (data: string) => {
			const newChat: ApiChatExpand = JSON.parse(data);
			dispatch(addNewChat(newChat));
		};

		const newChannelHandler = (data: string) => {
			const newChannel: ApiChannelExpand = JSON.parse(data);
			dispatch(addNewChannel(newChannel));
		};

		const updateChatsHandler = (data: string) => {
			const updatedChats: ApiChatExpand[] = JSON.parse(data);
			dispatch(setChats(updatedChats));
		};

		const updateChannelHandler = () => {
			dispatch(getAllChannelsAction());
			dispatch(getChannelsAction(currentUser.username));
		};

		socket.on('receiveMessage', receiveMessageHandler);
		socket.on('newChat', newChatHandler);
		socket.on('newChannel', newChannelHandler);
		socket.on('updateChats', updateChatsHandler);
		socket.on('updateChannel', updateChannelHandler);

		return () => {
			socket.off('receiveMessage', receiveMessageHandler);
			socket.off('newChat', newChatHandler);
			socket.off('newChannel', newChannelHandler);
			socket.off('updateChats', updateChatsHandler);
			socket.off('updateChannel', updateChannelHandler);
		};
	}, [currentUser.username, dispatch, socket]);

	// Fetching all channels
	React.useEffect(() => {
		dispatch(getAllChannelsAction());
	}, [dispatch]);

	// Updating selectedChat
	React.useEffect(() => {
		if (!selectedChat) return;

		const chat = chats.find((ch) => ch.id === selectedChat.id);

		if (chat) dispatch(setSelectedChat(chat));
	}, [chats, dispatch, selectedChat]);

	// Updating selectedChannel
	React.useEffect(() => {
		if (!selectedChannel) return;

		const channel = allChannels.find((ch) => ch.id === selectedChannel.id);

		if (channel) dispatch(setSelectedChannel(channel));
	}, [allChannels, dispatch, selectedChannel]);

	return (
		<div className="main-block messenger">
			<div className="main-block-title">
				<span>Messenger</span>
			</div>
			<div className="messenger-container">
				<Contacts/>
				<Chat />
			</div>
		</div>
	);
};

export default Messenger;
