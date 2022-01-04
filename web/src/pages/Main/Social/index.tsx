import './styles.scss';

import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocialBlockFriend } from 'components/SocialBlockFriend';
import { SocialBlockOnlineUser } from "components/SocialBlockOnlineUser/SocialBlockOnlineUser";
import { useAppSelector } from 'hook/reduxHooks';
import { ApiUserExpand } from 'models/ApiTypes';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import {getTargetUser} from "utils/getTargetUser";

const Social = () => {
	const [friends, setFriends] = React.useState<ApiUserExpand[]>([]);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { onlineUsers } = useAppSelector((state) => state.onlineUsers);
	const { allUsers } = useAppSelector((state) => state.allUsers);

	const onlineUsersDisplay = onlineUsers.filter((usr) => usr.login !== currentUser.username);

	React.useEffect(() => {
		const friendsLogins: string[] = [];
		const user = getTargetUser(allUsers, currentUser.username, 'login'); // allUsers.find((usr) => usr.login === currentUser.username);

		if (user) {
			for (const subscriber of user.subscribers) {
				if (user.subscriptions.find((usr) => usr.login === subscriber.login)) {
					friendsLogins.push(subscriber.login);
				}
			}
		}
		setFriends(allUsers.filter((usr) => friendsLogins.indexOf(usr.login) !== -1));
	}, [allUsers, currentUser.username, onlineUsers]);

	return (
		<Fade cascade triggerOnce damping={0.3}>
			<div className='social-scroll'>
				<div className="main-block-title social-title">
					<span>People</span>
				</div>
				<div className="social-block">
					<div className="social-block-title">
						<span>friends</span>
						<FontAwesomeIcon icon={faCircle} />
						<span>{friends.length}</span>
					</div>
					<ul>
						{friends.map((user) => {
							const userInOnline = onlineUsers.find((usr) => usr.id === user.id);

							if (userInOnline) return <SocialBlockOnlineUser key={user.id} user={userInOnline} />;

							return <SocialBlockFriend key={user.id} user={user} />;
						})}
					</ul>
				</div>
				<div className="social-block">
					<div className="social-block-title">
						<span>online</span>
						<FontAwesomeIcon icon={faCircle} />
						<span>{onlineUsersDisplay.length}</span>
					</div>
					<ul>
						{onlineUsersDisplay.map((user) => (
							<SocialBlockOnlineUser key={user.id} user={user} />
						))}
					</ul>
				</div>
			</div>
		</Fade>
	);
};

export default Social;
