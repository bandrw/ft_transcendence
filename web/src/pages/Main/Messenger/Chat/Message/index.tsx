import './styles.scss';

import { ApiMessage } from "models/apiTypes";
import Moment from "react-moment";

interface MessageProps {
	message: ApiMessage,
	fromCompanion: boolean
}

const Message = ({ message, fromCompanion }: MessageProps) => {
	if (fromCompanion)
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
