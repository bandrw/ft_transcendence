import { faBullhorn, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { joinPrivateChannel } from "api/messenger";
import { useAppDispatch } from "hook/reduxHooks";
import { ApiChannelExpand } from "models/ApiTypes";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { closeSelectedChat } from "store/reducers/messengerSlice";

interface PrivateProps {
	selectedChannel: ApiChannelExpand;
}

interface IJoinPrivateChannel {
	password: string;
}

const Private = ({ selectedChannel }: PrivateProps) => {
	const [joinError, setJoinError] = React.useState<string>('');
	const { register, handleSubmit, reset } = useForm<IJoinPrivateChannel>();
	const dispatch = useAppDispatch();

	const joinPrivateChannelHandler = useCallback(({ password }: IJoinPrivateChannel) => {
		joinPrivateChannel(selectedChannel.id, password)
			.catch(() => setJoinError('Wrong password'))
			.finally(() => reset({ password: '' }));
	}, [reset, selectedChannel.id]);

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
				<button className="messenger-chat-close-btn" onClick={() => dispatch(closeSelectedChat())} title="Close">
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<form
				onSubmit={handleSubmit(joinPrivateChannelHandler)}
				className="messenger-chat-join-private-form"
			>
				<div className="messenger-chat-join-private-form-top">
					<FontAwesomeIcon icon={faLock} />
					<span>Channel is private</span>
				</div>
				<input
					{...register('password')}
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
};

export default Private;
