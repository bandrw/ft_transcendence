import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from 'app/token';
import axios from 'axios';
import { ApiUserExpand } from 'models/ApiTypes';
import React from 'react';

interface CreateChatProps {
	setDefaultChatState: () => void;
	chatsToCreate: ApiUserExpand[];
	allUsers: ApiUserExpand[];
}

const CreateChat = ({ setDefaultChatState, chatsToCreate, allUsers }: CreateChatProps) => {
	return (
		<div className="messenger-chat">
			<div className="messenger-chat-info">
				<div>Create a new chat</div>
				<button className="messenger-chat-close-btn" onClick={setDefaultChatState} title="Close">
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<div className="messenger-create-chat">
				<p>Select a user</p>
				{allUsers
					.filter((usr) => chatsToCreate.find((u) => usr.login === u.login))
					.map((usr) => (
						<div
							className="messenger-create-chat-user"
							key={usr.id}
							onClick={() => {
								const data = { userTwoId: usr.id };
								axios
									.post('/chats/create', data, {
										headers: { Authorization: `Bearer ${getToken()}` },
									})
									.then(() => setDefaultChatState());
							}}
						>
							<div
								className="messenger-create-chat-user-img"
								style={{ backgroundImage: `url(${usr.url_avatar})` }}
							/>
							<div className="messenger-create-chat-user-login">{usr.login}</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default CreateChat;
