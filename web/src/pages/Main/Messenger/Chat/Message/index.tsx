import './styles.scss';

import { ApiMessage } from 'models/ApiTypes';
import moment from 'moment';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

interface MessageProps {
	message: ApiMessage;
	isFromCompanion: boolean;
	author?: { name: string; imageUrl: string };
}

const Message = ({ message, isFromCompanion, author }: MessageProps) => {
	const formattedDate = moment(message.date).format('DD MMMM YYYY');

	if (isFromCompanion) {
		if (author)
			return (
				<div className="message companions-message companions-message-channel" data-date={formattedDate}>
					<Link to={`/users/${author.name}`} className="companions-message-channel-name">
						{author.name}
					</Link>
					<Link
						className="companions-message-channel-img"
						style={{ backgroundImage: `url(${author.imageUrl})` }}
						to={`/users/${author.name}`}
					/>
					<div>{message.text}</div>
					<Moment className="message-time" date={message.date} format="HH:mm" />
				</div>
			);

		return (
			<div data-date={formattedDate} className="message companions-message">
				{message.text}
				<Moment className="message-time" date={message.date} format="HH:mm" />
			</div>
		);
	}

	return (
		<div className="message users-message" data-date={formattedDate}>
			{message.text}
			<Moment className="message-time" date={message.date} format="HH:mm" />
		</div>
	);
};

export default Message;
