import {
	faCheck,
	faChevronLeft,
	faCommentSlash,
	faCrown,
	faLock, faSignOutAlt,
	faTimes,
	faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import * as bcryptjs from "bcryptjs";
import { useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand, ApiChannelMember } from "models/ApiTypes";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getToken } from "utils/token";

const leaveChannel = (channelId: number) => {
	const data = { channelId };
	axios
		.post('/channels/leave', data, {
			headers: { Authorization: `Bearer ${getToken()}` },
		})
		.catch(() => {});
};

interface MuteButtonProps {
	member: ApiChannelMember;
	selectedChannel: ApiChannelExpand;
	showMuteChoices: number | null;
	setShowMuteChoices: React.Dispatch<React.SetStateAction<number | null>>;
}

const MuteButton = ({ member, selectedChannel, showMuteChoices, setShowMuteChoices }: MuteButtonProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	const mute = (unbanDate: number | null) => {
		const data = {
			channelId: selectedChannel.id,
			memberId: member.id,
			unbanDate: unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'),
		};
		axios
			.post('/channels/muteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
			.catch(() => {});
		setShowMuteChoices(null);
	};

	const unmute = () => {
		const data = {
			channelId: selectedChannel.id,
			memberId: member.id,
		};
		axios
			.post('/channels/unmuteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
			.catch(() => {});
		setShowMuteChoices(null);
	};

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
						<button className="ban-button-choices-unmute-btn" onClick={() => unmute()}>
							Unmute
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

interface MuteIndicatorProps {
	member: ApiChannelMember;
	selectedChannel: ApiChannelExpand;
}

const MuteIndicator = ({ member, selectedChannel }: MuteIndicatorProps) => {
	const ban = member.banLists.find(
		(list) =>
			list.channelId === selectedChannel.id &&
			(list.unbanDate === null || new Date(list.unbanDate) >= new Date()),
	);

	if (ban)
		return (
			<span
				className="messenger-chat-settings-members-list__member-mute"
				data-muted-until={
					ban.unbanDate === null
						? 'Muted'
						: `Muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`
				}
			>
				<FontAwesomeIcon icon={faCommentSlash} />
			</span>
		);

	return <span className="messenger-chat-settings-members-list__member-mute" />;
};

interface MemberListProps {
	selectedChannel: ApiChannelExpand;
	showMuteChoices: number | null;
	setShowMuteChoices: React.Dispatch<React.SetStateAction<number | null>>;
}

const MembersList = ({ selectedChannel, showMuteChoices, setShowMuteChoices }: MemberListProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	const getStatus = (member: ApiChannelMember) => {
		if (selectedChannel.ownerId === member.id) {
			return <FontAwesomeIcon icon={faCrown} />;
		}

		if (member.isAdmin) {
			return 'admin';
		}

		return '';
	};

	if (selectedChannel.ownerId === currentUser.id)
		return (
			<div className="messenger-chat-settings-members-list">
				{selectedChannel.members.map((member) => {
					return (
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
										onClick={() => {
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
											axios
												.put('/channels/updateMemberStatus', data, {
													headers: { Authorization: `Bearer ${getToken()}` },
												})
												.catch(() => {});
										}}
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
					);
				})}
			</div>
		);

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

interface ChannelSettingsProps {
	selectedChannel: ApiChannelExpand;
	closeSelectedChat: () => void;
	setDefaultChatState: () => void;
}

interface IChangeAccessibility {
	password: string;
}

const ChannelSettings = ({ selectedChannel, closeSelectedChat, setDefaultChatState }: ChannelSettingsProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const [showMuteChoices, setShowMuteChoices] = React.useState<number | null>(null);
	const [channelSettingsIsPrivate, setChannelSettingsIsPrivate] = React.useState<boolean>(selectedChannel.isPrivate);
	const [channelPasswordChangeErrors, setChannelPasswordChangeErrors] = React.useState<string>('');
	const { register, handleSubmit, reset } = useForm<IChangeAccessibility>();

	// Click outside of MuteChoices
	React.useEffect(() => {
		const windowClickHandler = () => {
			if (showMuteChoices) setShowMuteChoices(null);
		};

		window.addEventListener('click', windowClickHandler);

		return () => {
			window.removeEventListener('click', windowClickHandler);
		};
	}, [showMuteChoices]);

	const changeAccessibility = async ({ password }: IChangeAccessibility) => {
		if (channelSettingsIsPrivate && (!password || password.length < 6)) {
			setChannelPasswordChangeErrors("Password's length must be greater than 6");

			return;
		}

		const data = {
			channelId: selectedChannel.id,
			isPrivate: channelSettingsIsPrivate,
			password: channelSettingsIsPrivate ? await bcryptjs.hash(password, 10) : null,
		};
		axios
			.put('/channels/update', data, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then(() => {
				setChannelPasswordChangeErrors('');
				reset({ password: '' });
			});
	};

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<button onClick={() => setDefaultChatState()} style={{ marginRight: 15 }}>
					<FontAwesomeIcon style={{ marginTop: 2 }} icon={faChevronLeft} />
				</button>
				<div className="messenger-chat-info-channel">Settings</div>
				<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<div className="messenger-chat-settings">
				<div className="messenger-chat-settings-title">
					{selectedChannel.isPrivate && <FontAwesomeIcon icon={faLock} />}
					{selectedChannel.title}
				</div>
				<div className="messenger-chat-settings-name">{`@${selectedChannel.name}`}</div>
				<div className="messenger-chat-settings-subscribers">
					{selectedChannel.members.length === 1
						? `1 subscriber`
						: `${selectedChannel.members.length} subscribers`}
				</div>
				{selectedChannel.members.find((m) => m.id === currentUser.id) && (
					<div className="messenger-chat-settings-buttons">
						<button
							className="messenger-chat-settings-buttons__leave"
							onClick={() => leaveChannel(selectedChannel.id)}
						>
							<div>
								<FontAwesomeIcon icon={faSignOutAlt} />
							</div>
							<div>Leave</div>
						</button>
					</div>
				)}
				{selectedChannel.ownerId === currentUser.id && (
					<form
						className="messenger-chat-settings-accessibility"
						onSubmit={handleSubmit(changeAccessibility)}
					>
						<input
							defaultChecked={selectedChannel.isPrivate}
							onChange={(e) => setChannelSettingsIsPrivate(e.target.checked)}
							id="channel-is-private__checkbox"
							type="checkbox"
							name="is_private"
						/>
						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
						<label htmlFor="channel-is-private__checkbox">
							<div className="channel_is_private__checkbox">
								<FontAwesomeIcon icon={faCheck} />
							</div>
							Private
						</label>
						{channelSettingsIsPrivate && (
							<input
								{...register('password')}
								className="channel-is-private__password-input"
								type="password"
								placeholder="Enter new password"
							/>
						)}
						<div className="channel-is-private__errors">{channelPasswordChangeErrors}</div>
						<button
							type="submit"
						>
							Save
						</button>
					</form>
				)}
				<MembersList
					selectedChannel={selectedChannel}
					showMuteChoices={showMuteChoices}
					setShowMuteChoices={setShowMuteChoices}
				/>
			</div>
		</div>
	);
};

export default ChannelSettings;
