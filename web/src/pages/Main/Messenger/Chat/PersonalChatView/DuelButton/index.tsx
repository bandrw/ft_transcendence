import { faPlay, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "hook/reduxHooks";
import { ApiChatExpand, ApiUser } from "models/ApiTypes";
import React from "react";

interface DuelButtonProps {
	selectedChat: ApiChatExpand;
	companion: ApiUser;
}

const DuelButton = ({ selectedChat, companion }: DuelButtonProps) => {
	const [duelStatus, setDuelStatus] = React.useState<string>('green');
	const [localDuelStatus, setLocalDuelStatus] = React.useState<string>('green');
	const { socket } = useAppSelector((state) => state.socket);
	const { currentUser } = useAppSelector((state) => state.currentUser);

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
				if (localDuelStatus === 'yellow')
					socket.emit('cancelDuel', JSON.stringify({ enemyId: companion.id, chatId: selectedChat.id }));
				setDuelStatus('green');
			}
		};
	}, [companion.id, currentUser.username, localDuelStatus, selectedChat, socket]);

	const sendDuelEvent = React.useCallback((event: string) => {
		socket.emit(event, JSON.stringify({ enemyId: companion.id, chatId: selectedChat.id }));

		if (event === 'requestDuel') {
			setLocalDuelStatus('yellow');
		} else if (event === 'cancelDuel') {
			setLocalDuelStatus('green');
		}
	}, [companion.id, selectedChat.id, setLocalDuelStatus, socket]);

	React.useEffect(() => {
		sendDuelEvent('cancelDuel');
	}, [selectedChat, sendDuelEvent]);

	if (duelStatus === 'yellow' && localDuelStatus === 'green')
		return (
			<button
				className="messenger-chat-info-play-btn"
				onClick={() => sendDuelEvent('requestDuel')}
			>
				<span className="messenger-chat-info-play-btn-text">Accept</span>
				<span className="messenger-chat-info-play-btn-img">
					<FontAwesomeIcon icon={faPlay} />
				</span>
			</button>
		);

	if (duelStatus === 'green' && localDuelStatus === 'green')
		return (
			<button
				className="messenger-chat-info-play-btn"
				onClick={() => sendDuelEvent('requestDuel')}
			>
				<span className="messenger-chat-info-play-btn-text">Play pong</span>
				<span className="messenger-chat-info-play-btn-img">
					<FontAwesomeIcon icon={faPlay} />
				</span>
			</button>
		);

	return (
		<button
			className="messenger-chat-info-play-btn"
			onClick={() => sendDuelEvent('cancelDuel')}
		>
			<span className="messenger-chat-info-play-btn-text">Waiting...</span>
			<span className="messenger-chat-info-play-btn-img messenger-chat-info-play-btn-img-searching">
				<FontAwesomeIcon icon={faTimesCircle} />
			</span>
		</button>
	);
};

export default DuelButton;
