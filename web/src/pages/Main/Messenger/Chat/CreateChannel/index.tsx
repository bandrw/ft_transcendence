import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "app/token";
import axios from "axios";
import * as bcryptjs from "bcryptjs";
import React, { FormEvent } from "react";

interface CreateChannelProps {
	setDefaultChatState: () => void
}

const CreateChannel = ({ setDefaultChatState }: CreateChannelProps) => {
	const [isPrivate, setIsPrivate] = React.useState<boolean>(false);
	const nameRef = React.useRef<HTMLInputElement>(null);
	const titleRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);
	const [errors, setErrors] = React.useState('');

	const createChannelForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const name = nameRef.current?.value || '';
		const title = titleRef.current?.value || '';
		const password = passwordRef.current?.value || '';

		if (isPrivate && password.length < 6) {
			setErrors('Password\'s length must be longer than 6');
			return ;
		}

		const data = {
			name,
			title,
			isPrivate,
			password: isPrivate ? await bcryptjs.hash(password, 10) : null
		};
		axios.post<any, any>('/channels/create', data, {
			headers: { Authorization: `Bearer ${getToken()}` }
		})
			.then(() => setDefaultChatState())
			.catch(e => setErrors(e.response?.data?.message || 'Error'));
	};

	return (
		<div className='messenger-chat'>
			<div className='messenger-chat-info'>
				<div>
					Create a new channel
				</div>
				<button
					className='messenger-chat-close-btn'
					onClick={ setDefaultChatState }
					title='Close'
				>
					<FontAwesomeIcon icon={ faTimes }/>
				</button>
			</div>
			<form className='messenger-create-channel' onSubmit={ createChannelForm }>
				<input ref={ nameRef } required={ true } type='text' placeholder='Name'/>
				<input ref={ titleRef } required={ true } type='text' placeholder='Title'/>
				<div className='messenger-create-channel-visibility'>
					<button type='button' className='is-private-checkbox' onClick={ () => setIsPrivate(false) }>
						<div className={ isPrivate ? 'visibility' : 'visibility-active' }>
							{
								!isPrivate &&
								<FontAwesomeIcon icon={ faCheck }/>
							}
						</div>
						<span>Public</span>
					</button>
					<button type='button' className='is-private-checkbox' onClick={ () => setIsPrivate(true) }>
						<div className={ isPrivate ? 'visibility-active' : 'visibility' }>
							{
								isPrivate &&
								<FontAwesomeIcon icon={ faCheck }/>
							}
						</div>
						<span>Private</span>
					</button>
				</div>
				{
					isPrivate &&
					<input ref={ passwordRef } name='password' type='password' placeholder='Password'/>
				}
				<div className='messenger-create-channel-errors'>{ errors }</div>
				<button type='submit'>Create</button>
			</form>
		</div>
	);
};

export default CreateChannel;
