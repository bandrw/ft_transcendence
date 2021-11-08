import './styles.scss';

import { ApiMessage, ApiUser } from "models/apiTypes";
import Moment from "react-moment";

interface MessageProps {
	message: ApiMessage,
	companion: ApiUser
}

const Message = ({ message, companion }: MessageProps) => {
	if (companion.id === message.fromUserId)
		return (
			<div className='message companions-message'>
				{ message.text }
				<Moment className='message-time' date={ message.date } format='HH:mm'/>
			</div>
		);

	return (
		<div className='message users-message'>
			{ message.text }
			<Moment className='message-time' date={ message.date } format='HH:mm'/>
		</div>
	);
};

export default Message;
