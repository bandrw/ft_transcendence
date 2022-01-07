import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { muteChatMember, unmuteChatMember } from "api/messenger";
import { ApiBanList, ApiChatExpand, ApiUser } from "models/ApiTypes";
import moment from "moment";
import React, { useCallback } from "react";

interface MuteChoicesProps {
	selectedChat: ApiChatExpand;
	companion: ApiUser;
	bannedByCurrentUser: boolean;
	ban: ApiBanList | undefined;
}

const BanButton = ({ selectedChat, companion, bannedByCurrentUser, ban }: MuteChoicesProps) => {
	const [showChatMuteChoices, setShowChatMuteChoices] = React.useState<boolean>(false);

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

	const mute = useCallback((unbanDate: number | null) => {
		muteChatMember(selectedChat.id, companion.id, unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'))
			.catch(() => {});
		setShowChatMuteChoices(false);
	}, [companion.id, selectedChat.id, setShowChatMuteChoices]);

	const unmute = useCallback(() => {
		unmuteChatMember(selectedChat.id, companion.id)
			.catch(() => {});
		setShowChatMuteChoices(false);
	}, [companion.id, selectedChat.id, setShowChatMuteChoices]);

	return (
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
			{showChatMuteChoices &&
				<div className="ban-button-choices-wrapper" onClick={(e) => e.stopPropagation()}>
					<div className="ban-button-choices">
						{!bannedByCurrentUser ? (
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
						) : (
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
			}
		</div>
	);
};

export default BanButton;
