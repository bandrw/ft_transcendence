import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateChannelMemberStatus } from "api/messenger";
import { useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand, ApiChannelMember } from "models/ApiTypes";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";

import MuteButton from "./MuteButton";
import MuteIndicator from "./MuteIndicator";

interface MemberListProps {
	selectedChannel: ApiChannelExpand;
	showMuteChoices: number | null;
	setShowMuteChoices: React.Dispatch<React.SetStateAction<number | null>>;
}

const MembersList = ({ selectedChannel, showMuteChoices, setShowMuteChoices }: MemberListProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	const getStatus = useCallback((member: ApiChannelMember) => {
		if (selectedChannel.ownerId === member.id) {
			return <FontAwesomeIcon icon={faCrown} />;
		}

		if (member.isAdmin) {
			return 'admin';
		}

		return '';
	}, [selectedChannel.ownerId]);

	const updateMemberStatusHandler = useCallback((member: ApiChannelMember) => {
		const data = {
			channelId: selectedChannel.id,
			memberId: member.id,
			status: '',
		};

		if (member.isAdmin) {
			data.status = 'member';
		} else {
			data.status = 'admin';
		}
		updateChannelMemberStatus(data.channelId, data.memberId, data.status)
			.catch(() => {});
	}, [selectedChannel.id]);

	// Owner view
	if (selectedChannel.ownerId === currentUser.id)
		return (
			<div className="messenger-chat-settings-members-list">
				{selectedChannel.members.map((member) => (
					<div key={member.id} className="messenger-chat-settings-members-list__member">
						<span className="messenger-chat-settings-members-list__member-user">
							<span
								className="messenger-chat-settings-members-list__member-img"
								style={{ backgroundImage: `url(${member.url_avatar})` }}
							/>
							<Link
								to={`/users/${member.login}`}
								className="messenger-chat-settings-members-list__member-login"
							>
								{member.login}
							</Link>
						</span>
						<MuteIndicator member={member} selectedChannel={selectedChannel} />
						<div className="messenger-chat-settings-members-list__member-status">
							{selectedChannel.ownerId === member.id ? (
								<FontAwesomeIcon icon={faCrown} />
							) : (
								// eslint-disable-next-line jsx-a11y/control-has-associated-label
								<button
									className={`toggle-btn ${member.isAdmin && 'toggle-btn-active'}`}
									data-description={
										member.isAdmin ? 'Switch to member' : 'Switch to admin'
									}
									onClick={() => updateMemberStatusHandler(member)}
								/>
							)}
						</div>
						<MuteButton
							member={member}
							selectedChannel={selectedChannel}
							showMuteChoices={showMuteChoices}
							setShowMuteChoices={setShowMuteChoices}
						/>
					</div>
				))}
			</div>
		);

	// Admin view
	if (selectedChannel.members.find((m) => m.id === currentUser.id)?.isAdmin)
		return (
			<div className="messenger-chat-settings-members-list">
				{selectedChannel.members.map((member) => (
					<div key={member.id} className="messenger-chat-settings-members-list__member">
						<div className="messenger-chat-settings-members-list__member-user">
							<div
								className="messenger-chat-settings-members-list__member-img"
								style={{ backgroundImage: `url(${member.url_avatar})` }}
							/>
							<Link
								to={`/users/${member.login}`}
								className="messenger-chat-settings-members-list__member-login"
							>
								{member.login}
							</Link>
						</div>
						<MuteIndicator member={member} selectedChannel={selectedChannel} />
						<div className="messenger-chat-settings-members-list__member-status">
							{getStatus(member)}
						</div>
						<MuteButton
							member={member}
							selectedChannel={selectedChannel}
							showMuteChoices={showMuteChoices}
							setShowMuteChoices={setShowMuteChoices}
						/>
					</div>
				))}
			</div>
		);

	// Regular view
	return (
		<div className="messenger-chat-settings-members-list">
			{selectedChannel.members.map((member) => (
				<div key={member.id} className="messenger-chat-settings-members-list__member">
					<div className="messenger-chat-settings-members-list__member-user">
						<div
							className="messenger-chat-settings-members-list__member-img"
							style={{ backgroundImage: `url(${member.url_avatar})` }}
						/>
						<Link
							to={`/users/${member.login}`}
							className="messenger-chat-settings-members-list__member-login"
						>
							{member.login}
						</Link>
					</div>
					<MuteIndicator member={member} selectedChannel={selectedChannel} />
					<div className="messenger-chat-settings-members-list__member-status">
						{getStatus(member)}
					</div>
				</div>
			))}
		</div>
	);
};

export default MembersList;
