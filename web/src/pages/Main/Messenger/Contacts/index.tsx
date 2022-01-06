import { useAppDispatch, useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand, ApiChatExpand } from "models/ApiTypes";
import React, { ChangeEvent, useCallback } from "react";
import {
	ChatState,
	setChatState,
	setSelectedChannel,
	setSelectedChat,
} from "store/reducers/messengerSlice";

import Channel from "./Channel";
import Chat from "./Chat";
import CreateMenuButton from "./CreateMenuButton";

const Contacts = () => {
	const [searchPattern, setSearchPattern] = React.useState('');
	const {
		selectedChat,
		selectedChannel,
		chats,
		channels,
		allChannels,
	} = useAppSelector((state) => state.messenger);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const dispatch = useAppDispatch();

	/**
	 * Channels to display if searching
	 */
	const matchedChannels: ApiChannelExpand[] = searchPattern.length !== 0 ? allChannels.filter(
		(channel) =>
			!channels.find((ch) => ch.id === channel.id) &&
			(channel.name.trim().toLowerCase().includes(searchPattern.trim().toLowerCase()) ||
				channel.title.trim().toLowerCase().includes(searchPattern.trim().toLowerCase())),
	) : [];

	const searchChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) =>
		setSearchPattern(e.target.value), []);

	const chatsFilter = useCallback((chat: ApiChatExpand, pattern: string) => {
		const companion =
			chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne;

		return companion.login
			.trim()
			.toLowerCase()
			.includes(pattern.trim().toLowerCase());
	}, [currentUser.username]);

	const channelFilter = useCallback((channel: ApiChannelExpand, pattern: string) => (
		channel.name.trim().toLowerCase().includes(pattern.trim().toLowerCase()) ||
		channel.title.trim().toLowerCase().includes(pattern.trim().toLowerCase())
	), []);

	const selectChat = useCallback((chat: ApiChatExpand) => {
		return () => {
			if (selectedChat?.id !== chat.id) {
				dispatch(setSelectedChat(chat));
				dispatch(setSelectedChannel(null));
				dispatch(setChatState(ChatState.Default));
			}
		};
	}, [dispatch, selectedChat?.id]);

	const selectChannel = useCallback((channel: ApiChannelExpand) => {
		return () => {
			if (selectedChannel?.id !== channel.id) {
				dispatch(setSelectedChannel(channel));
				dispatch(setSelectedChat(null));
				dispatch(setChatState(ChatState.Default));
			}
		};
	}, [dispatch, selectedChannel?.id]);

	return (
		<div className="messenger-contacts">
			<div className="messenger-contacts-header">
				<input
					name='search-pattern'
					type="text"
					placeholder="Search"
					className="messenger-contacts-header-search"
					onChange={searchChangeHandler}
				/>
				<CreateMenuButton/>
			</div>
			<div className="messenger-contacts-scroll">
				{chats
					.filter((chat) => chatsFilter(chat, searchPattern))
					.map((chat) => (
						<Chat
							key={chat.id}
							companion={chat.userOne.login === currentUser.username ? chat.userTwo : chat.userOne}
							isSelected={chat.id === selectedChat?.id}
							selectChat={selectChat(chat)}
						/>
					))
				}
				{channels
					.filter((channel) => channelFilter(channel, searchPattern))
					.map((channel) => (
						<Channel
							key={channel.id}
							title={channel.title}
							isSelected={selectedChannel?.id === channel.id}
							selectChannel={selectChannel(channel)}
							isPrivate={channel.isPrivate}
						/>
					))
				}
				{searchPattern && <div className="messenger-contacts-search-scope">global search</div>}
				{matchedChannels.map((channel) => (
					<Channel
						key={channel.id}
						title={channel.title}
						isSelected={selectedChannel?.id === channel.id}
						selectChannel={selectChannel(channel)}
						isPrivate={channel.isPrivate}
					/>
				))}
				{chats.length + channels.length === 0 && (
					<div className="messenger-contacts-empty-msg">You have no chats yet</div>
				)}
			</div>
		</div>
	);
};

export default Contacts;
