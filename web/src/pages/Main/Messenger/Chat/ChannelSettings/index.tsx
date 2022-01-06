import {
	faCheck,
	faChevronLeft,
	faLock, faSignOutAlt,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { leaveChannel, updateChannel } from "api/messenger";
import * as bcryptjs from "bcryptjs";
import { useAppDispatch, useAppSelector } from "hook/reduxHooks";
import { ApiChannelExpand } from "models/ApiTypes";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { closeSelectedChat, setDefaultChatState } from "store/reducers/messengerSlice";

import MembersList from "./MembersList";

interface ChannelSettingsProps {
	selectedChannel: ApiChannelExpand;
}

interface IChangeAccessibilityForm {
	password: string;
}

const ChannelSettings = ({ selectedChannel }: ChannelSettingsProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const [showMuteChoices, setShowMuteChoices] = React.useState<number | null>(null);
	const [channelSettingsIsPrivate, setChannelSettingsIsPrivate] = React.useState<boolean>(selectedChannel.isPrivate);
	const [channelPasswordChangeErrors, setChannelPasswordChangeErrors] = React.useState<string>('');
	const { register, handleSubmit, reset } = useForm<IChangeAccessibilityForm>();
	const dispatch = useAppDispatch();

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

	const changeAccessibility = useCallback(async ({ password }: IChangeAccessibilityForm) => {
		if (channelSettingsIsPrivate && (!password || password.length < 6)) {
			return setChannelPasswordChangeErrors("Password's length must be greater than 6");
		}

		updateChannel(
			selectedChannel.id,
			channelSettingsIsPrivate,
			channelSettingsIsPrivate ? await bcryptjs.hash(password, 10) : null,
		)
			.then(() => {
				setChannelPasswordChangeErrors('');
				reset({ password: '' });
			});
	}, [channelSettingsIsPrivate, reset, selectedChannel.id]);

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<button onClick={() => dispatch(setDefaultChatState())} style={{ marginRight: 15 }}>
					<FontAwesomeIcon style={{ marginTop: 2 }} icon={faChevronLeft} />
				</button>
				<div className="messenger-chat-info-channel">Settings</div>
				<button className="messenger-chat-close-btn" onClick={() => dispatch(closeSelectedChat())} title="Close">
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
							onClick={() => leaveChannel(selectedChannel.id).catch(() => {})}
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
