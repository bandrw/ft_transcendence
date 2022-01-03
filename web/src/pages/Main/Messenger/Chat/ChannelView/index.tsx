import { faBullhorn, faLock, faPaperPlane, faSlidersH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAppSelector } from "hook/reduxHooks";
import { ApiBanList, ApiChannelExpand } from "models/ApiTypes";
import moment from "moment";
import Message from "pages/Main/Messenger/Chat/Message";
import React from "react";
import { useForm } from "react-hook-form";
import { getToken } from "utils/token";

import {getTargetUser} from "../../../../../utils/getTargetUser";
import { ISendMessage } from "../index";

const joinChannel = (channelId: number) => {
	axios
		.post(
			'/channels/join',
			{ channelId },
			{ headers: { Authorization: `Bearer ${getToken()}` } },
		)
		.then();
};

interface ChannelViewProps {
	selectedChannel: ApiChannelExpand;
	closeSelectedChat: () => void;
	setSettingsChatState: () => void;
}

interface IJoinPrivateChannel {
	password: string;
}

const ChannelView = ({ selectedChannel, closeSelectedChat, setSettingsChatState }: ChannelViewProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const [joinError, setJoinError] = React.useState<string>('');
	const { socket } = useAppSelector((state) => state.socket);
	const { register: sendMsgRegister, handleSubmit: sendMsgHandleSubmit, reset: sendMsgReset } = useForm<ISendMessage>();
	const {
		register: joinPrivateRegister,
		handleSubmit: joinPrivateHandleSubmit,
		reset: joinPrivateReset,
	} = useForm<IJoinPrivateChannel>();

	const isMember = selectedChannel.members.find((member) => member.id === currentUser.id);

	let sendMsgPlaceholder: string;
	let ban: ApiBanList | undefined;

	if (isMember && isMember.banLists) {
		ban = isMember.banLists.find(
			(list) =>
				list.channelId === selectedChannel.id &&
				(list.unbanDate === null || new Date(list.unbanDate) > new Date()),
		);
	}

	if (ban) {
		if (ban.unbanDate === null)
			sendMsgPlaceholder = 'You are muted';
		else
			sendMsgPlaceholder = `You are muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`;
	} else {
		sendMsgPlaceholder = 'Write a message';
	}

	const joinPrivateChannel = ({ password }: IJoinPrivateChannel) => {
		axios
			.post(
				'/channels/join',
				{ channelId: selectedChannel.id, password },
				{ headers: { Authorization: `Bearer ${getToken()}` } },
			)
			.catch(() => setJoinError('Wrong password'))
			.finally(() => joinPrivateReset({ password: '' }));
	};

	if (selectedChannel.isPrivate && !isMember)
		return (
			<div className="messenger-chat">
				<div className="messenger-chat-info">
					<div className="messenger-chat-info-channel">
						<div className="messenger-chat-info-img">
							<FontAwesomeIcon icon={faBullhorn} />
						</div>
						<div className="messenger-chat-info-name">
							<div className="messenger-chat-info-title">{selectedChannel.title}</div>
							<div className="messenger-chat-info-members">
								{ selectedChannel.members.length === 1 ? '1 member' : `${selectedChannel.members.length} members` }
							</div>
						</div>
					</div>
					<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<form
					onSubmit={joinPrivateHandleSubmit(joinPrivateChannel)}
					className="messenger-chat-join-private-form"
				>
					<div className="messenger-chat-join-private-form-top">
						<FontAwesomeIcon icon={faLock} />
						<span>Channel is private</span>
					</div>
					<input
						{...joinPrivateRegister('password')}
						type="password"
						placeholder="Password"
					/>
					<div className="messenger-chat-join-private-errors">{joinError}</div>
					<button type="submit">
						Join
					</button>
				</form>
			</div>
		);

	const sendMsg = ({ message }: ISendMessage) => {
		message = message.trim();

		if (message.length === 0) return;

		const data = {
			text: message,
			channelId: selectedChannel.id,
		};
		socket.emit('sendMessage', JSON.stringify(data));
		sendMsgReset({ message: '' });
	};

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<div className="messenger-chat-info-channel">
					<div className="messenger-chat-info-img">
						<FontAwesomeIcon icon={faBullhorn} />
					</div>
					<div className="messenger-chat-info-name">
						<div className="messenger-chat-info-title">{selectedChannel.title}</div>
						<div className="messenger-chat-info-members">
							{ selectedChannel.members.length === 1 ? '1 member' : `${selectedChannel.members.length} members` }
						</div>
					</div>
				</div>
				<button className="messenger-chat-info-settings-btn" onClick={() => setSettingsChatState()}>
					<FontAwesomeIcon icon={faSlidersH} />
				</button>
				<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<div className="messenger-chat-messages">
				{selectedChannel.messages.map((msg) => {
					const author = getTargetUser(allUsers, msg.fromUserId, 'id'); // allUsers.find((usr) => usr.id === msg.fromUserId);

					return (
						<Message
							key={msg.id}
							message={msg}
							isFromCompanion={msg.fromUserId !== currentUser.id}
							author={author ? { name: author.login, imageUrl: author.url_avatar } : undefined}
						/>
					);
				})}
			</div>
			{isMember ? (
				<form className="messenger-chat-form" onSubmit={sendMsgHandleSubmit(sendMsg)}>
					<input
						disabled={!!ban}
						className="messenger-chat-input"
						type="text"
						{...sendMsgRegister('message')}
						placeholder={sendMsgPlaceholder}
					/>
					<button disabled={!!ban} type="submit" className="messenger-chat-send-btn">
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</form>
			) : (
				<button
					className="messenger-chat-join-btn"
					onClick={() => joinChannel(selectedChannel.id)}
				>
					Join
				</button>
			)}
		</div>
	);
};

export default ChannelView;
