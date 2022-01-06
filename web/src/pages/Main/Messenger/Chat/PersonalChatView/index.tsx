import {
	faPaperPlane,
	faPlay,
	faTimes,
	faTimesCircle,
	faVolumeMute,
	faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "hook/reduxHooks";
import { ApiChatExpand } from "models/ApiTypes";
import moment from "moment";
import Message from "pages/Main/Messenger/Chat/Message";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { closeSelectedChat } from "store/reducers/messengerSlice";
import { getToken } from "utils/token";

import { ISendMessage } from "../index";

interface PersonalChatViewProps {
	selectedChat: ApiChatExpand;
	duelStatus: string;
	localDuelStatus: string;
	setLocalDuelStatus: React.Dispatch<React.SetStateAction<string>>;
}

const PersonalChatView = ({
														selectedChat,
														duelStatus,
														localDuelStatus,
														setLocalDuelStatus,
}: PersonalChatViewProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const [showChatMuteChoices, setShowChatMuteChoices] = React.useState<boolean>(false);
	const { register, handleSubmit, reset } = useForm<ISendMessage>();
	const { socket } = useAppSelector((state) => state.socket);
	const companion = selectedChat.userOne?.login === currentUser.username ? selectedChat.userTwo : selectedChat.userOne;
	const dispatch = useAppDispatch();

	const sendDuelEvent = React.useCallback((event: string) => {
		socket.emit(event, JSON.stringify({ enemyId: companion.id, chatId: selectedChat.id }));

		if (event === 'requestDuel') {
			setLocalDuelStatus('yellow');
		} else if (event === 'cancelDuel') {
			setLocalDuelStatus('green');
		}
	}, [companion.id, selectedChat.id, setLocalDuelStatus, socket]);

	// Click outside of ChatMuteChoices
	React.useEffect(() => {
		const windowClickHandler = () => {
			if (showChatMuteChoices) setShowChatMuteChoices(false);
		};

		window.addEventListener('click', windowClickHandler);

		return () => {
			window.removeEventListener('click', windowClickHandler);
		};
	}, [showChatMuteChoices]);

	React.useEffect(() => {
		sendDuelEvent('cancelDuel');
	}, [setLocalDuelStatus, selectedChat, sendDuelEvent]);

	const mute = (unbanDate: number | null) => {
		const data = {
			chatId: selectedChat.id,
			memberId: companion.id,
			unbanDate: unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'),
		};
		axios
			.post('/chats/muteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
			.catch(() => {});
		setShowChatMuteChoices(false);
	};

	const unmute = () => {
		const data = {
			chatId: selectedChat.id,
			memberId: companion.id,
		};
		axios
			.post('/chats/unmuteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
			.catch(() => {});
		setShowChatMuteChoices(false);
	};

	let sendMsgPlaceholder: string;
	const ban = selectedChat.banLists.find(
		(list) =>
			list.chatId === selectedChat.id && (list.unbanDate === null || new Date(list.unbanDate) > new Date()),
	);
	const bannedByCurrentUser = ban && ban.initiatorId === currentUser.id;

	if (ban?.memberId === currentUser.id) {
		if (ban?.unbanDate === null) {
			sendMsgPlaceholder = 'You are muted';
		} else {
			sendMsgPlaceholder = `You are muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`;
		}
	} else {
		sendMsgPlaceholder = 'Write a message';
	}

	const sendMsg = ({ message }: ISendMessage) => {
		const text = message.trim();

		if (text.length === 0) return;

		const data = {
			text,
			chatId: selectedChat.id,
		};
		socket.emit('sendMessage', JSON.stringify(data));
		reset({ message: '' });
	};

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<Link className="messenger-chat-info-companion" to={`/users/${companion.login}`}>
					<div
						className="messenger-chat-info-img"
						style={{ backgroundImage: `url(${companion.url_avatar})` }}
					/>
					<div>{companion.login}</div>
				</Link>
				<div className="ban-button-wrapper">
					<button
						className="ban-button messenger-chat-info-mute"
						title="Mute"
						disabled={ban && !bannedByCurrentUser}
						onClick={() => setShowChatMuteChoices((prev) => !prev)}
					>
						{ban ? (
							<FontAwesomeIcon className="messenger-chat-info-mute__muted-icon" icon={faVolumeMute} />
						) : (
							<FontAwesomeIcon icon={faVolumeUp} />
						)}
					</button>
					{showChatMuteChoices && (
						<div className="ban-button-choices-wrapper" onClick={(e) => e.stopPropagation()}>
							<div className="ban-button-choices">
								{!bannedByCurrentUser && (
									<>
										<button
											className="ban-button-choices-mute-btn"
											onClick={() => mute(Date.now() + 3600 * 1000)}
										>
											Mute for 1 hour
										</button>
										<button
											className="ban-button-choices-mute-btn"
											onClick={() => mute(Date.now() + 8 * 3600 * 1000)}
										>
											Mute for 8 hours
										</button>
										<button className="ban-button-choices-mute-btn" onClick={() => mute(null)}>
											Mute forever
										</button>
									</>
								)}
								{bannedByCurrentUser && (
									<button
										className="ban-button-choices-mute-btn"
										onClick={unmute}
										style={{ borderRadius: 18 }}
									>
										Unmute
									</button>
								)}
							</div>
						</div>
					)}
				</div>
				{duelStatus === 'yellow' && localDuelStatus === 'green' && (
					<button
						className="messenger-chat-info-play-btn"
						onClick={() => sendDuelEvent('requestDuel')}
					>
						<span className="messenger-chat-info-play-btn-text">Accept</span>
						<span className="messenger-chat-info-play-btn-img">
							<FontAwesomeIcon icon={faPlay} />
						</span>
					</button>
				)}
				{duelStatus === 'green' && localDuelStatus === 'green' && (
					<button
						className="messenger-chat-info-play-btn"
						onClick={() => sendDuelEvent('requestDuel')}
					>
						<span className="messenger-chat-info-play-btn-text">Play pong</span>
						<span className="messenger-chat-info-play-btn-img">
							<FontAwesomeIcon icon={faPlay} />
						</span>
					</button>
				)}
				{localDuelStatus === 'yellow' && (
					<button
						className="messenger-chat-info-play-btn"
						onClick={() => sendDuelEvent('cancelDuel')}
					>
						<span className="messenger-chat-info-play-btn-text">Waiting...</span>
						<span className="messenger-chat-info-play-btn-img messenger-chat-info-play-btn-img-searching">
							<FontAwesomeIcon icon={faTimesCircle} />
						</span>
					</button>
				)}
				<button
					className="messenger-chat-close-btn"
					onClick={() => {
						if (localDuelStatus === 'yellow') {
							sendDuelEvent('cancelDuel');
						}
						dispatch(closeSelectedChat());
					}}
					title="Close"
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<div className="messenger-chat-messages">
				{selectedChat.messages.map((msg) => (
					<Message key={msg.id} message={msg} isFromCompanion={msg.fromUserId !== currentUser.id} />
				))}
			</div>
			<form className="messenger-chat-form" onSubmit={handleSubmit(sendMsg)}>
				<input
					disabled={ban && !bannedByCurrentUser}
					className="messenger-chat-input"
					type="text"
					{...register('message')}
					placeholder={sendMsgPlaceholder}
				/>
				<button
					disabled={ban && !bannedByCurrentUser}
					type="submit"
					className="messenger-chat-send-btn"
				>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	);
};

export default PersonalChatView;
