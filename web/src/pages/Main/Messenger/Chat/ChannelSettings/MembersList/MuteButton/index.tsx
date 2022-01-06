import { faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { muteChannelMember, unmuteChannelMember } from "api/messenger";
import { useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand, ApiChannelMember } from "models/ApiTypes";
import moment from "moment";
import React, { useCallback } from "react";

interface MuteButtonProps {
	member: ApiChannelMember;
	selectedChannel: ApiChannelExpand;
	showMuteChoices: number | null;
	setShowMuteChoices: React.Dispatch<React.SetStateAction<number | null>>;
}

const MuteButton = ({ member, selectedChannel, showMuteChoices, setShowMuteChoices }: MuteButtonProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	const mute = useCallback((unbanDate: number | null) => {
		const data = {
			channelId: selectedChannel.id,
			memberId: member.id,
			unbanDate: unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'),
		};
		muteChannelMember(data.channelId, data.memberId, data.unbanDate)
			.catch(() => {});
		setShowMuteChoices(null);
	}, [member.id, selectedChannel.id, setShowMuteChoices]);

	const unmute = useCallback(() => {
		unmuteChannelMember(selectedChannel.id, member.id)
			.catch(() => {});
		setShowMuteChoices(null);
	}, [member.id, selectedChannel.id, setShowMuteChoices]);

	if (currentUser.id === member.id || member.id === selectedChannel.ownerId || member.isAdmin)
		return <div style={{ width: 34 }} />;

	return (
		<div className="ban-button-wrapper">
			<button
				className="ban-button"
				onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					e.stopPropagation();
					setShowMuteChoices((prev) => (prev === member.id ? null : member.id));
				}}
			>
				<FontAwesomeIcon icon={faVolumeMute} />
			</button>
			{showMuteChoices === member.id && (
				<div className="ban-button-choices-wrapper" onClick={(e) => e.stopPropagation()}>
					<div className="ban-button-choices">
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
						<button className="ban-button-choices-unmute-btn" onClick={unmute}>
							Unmute
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MuteButton;