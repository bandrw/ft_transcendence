import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { FormEvent } from "react";

interface CreateChannelProps {
	setDefaultChatState: () => void
}

const CreateChannel = ({ setDefaultChatState }: CreateChannelProps) => {
	const [isPrivate, setIsPrivate] = React.useState(false);
	const nameRef = React.useRef<HTMLInputElement>(null);
	const titleRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const createChannelForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const name = nameRef.current?.value || '';
		const title = titleRef.current?.value || '';
		const password = passwordRef.current?.value || '';

		const data = {
			name: name,
			title: title,
			isPrivate: isPrivate,
			password: password
		};
		await axios.post('/channels/create', data, {
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		});
		setDefaultChatState();
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
				<button type='submit'>Create</button>
			</form>
		</div>
	);
};

export default CreateChannel;
