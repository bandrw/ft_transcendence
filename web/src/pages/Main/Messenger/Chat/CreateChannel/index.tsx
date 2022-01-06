import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createChannel } from "api/messenger";
import * as bcryptjs from 'bcryptjs';
import { useAppDispatch } from "hook/reduxHooks";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { setDefaultChatState } from "store/reducers/messengerSlice";

interface ICreateChannelForm {
	name: string;
	title: string;
	password?: string;
}

const CreateChannel = () => {
	const [isPrivate, setIsPrivate] = React.useState<boolean>(false);
	const [errorMessage, setErrorMessage] = React.useState('');
	const dispatch = useAppDispatch();
	const { register, handleSubmit, setError, formState: { errors } } = useForm<ICreateChannelForm>();

	React.useEffect(() => {
		const allErrors = [errors.name, errors.title, errors.password];

		for (const err of allErrors) {
			if (err) return setErrorMessage(err.message || 'Error');
		}
	}, [errors]);

	const createChannelForm = useCallback(async ({ name, title, password }: ICreateChannelForm) => {
		if (isPrivate && password && password.length < 6) {
			return setError('password', { type: 'manual', message: 'Password\'s length must be greater than 6' });
		}

		createChannel(name, title, isPrivate, isPrivate && password ? await bcryptjs.hash(password, 10) : null)
			.then(() => dispatch(setDefaultChatState()))
			.catch((err) => setErrorMessage(err.response?.data?.message || 'Error'));
	}, [dispatch, isPrivate, setError]);

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<div>Create a new channel</div>
				<button className="messenger-chat-close-btn" onClick={() => dispatch(setDefaultChatState())} title="Close">
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<form className="messenger-create-channel" onSubmit={handleSubmit(createChannelForm)}>
				<input
					required
					type="text"
					placeholder="Name"
					{...register('name', { required: true })}
				/>
				<input
					required
					type="text"
					placeholder="Title"
					{...register('title', { required: true })}
				/>
				<div className="messenger-create-channel-visibility">
					<button type="button" className="is-private-checkbox" onClick={() => setIsPrivate(false)}>
						<div className={isPrivate ? 'visibility' : 'visibility-active'}>
							{!isPrivate && <FontAwesomeIcon icon={faCheck} />}
						</div>
						<span>Public</span>
					</button>
					<button type="button" className="is-private-checkbox" onClick={() => setIsPrivate(true)}>
						<div className={isPrivate ? 'visibility-active' : 'visibility'}>
							{isPrivate && <FontAwesomeIcon icon={faCheck} />}
						</div>
						<span>Private</span>
					</button>
				</div>
				{isPrivate &&
					<input
						type="password"
						placeholder="Password"
						required
						{...register('password', { required: true })}
					/>
				}
				<div className="messenger-create-channel-errors">{errorMessage}</div>
				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default CreateChannel;
