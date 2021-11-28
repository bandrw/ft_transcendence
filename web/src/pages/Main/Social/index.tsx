import './styles.scss';

import { faCircle, faTv } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "app/hooks";
import axios from "axios";
import { ApiUpdateUser, ApiUserExpand, ApiUserStatus } from "models/apiTypes";
import React from 'react';
import { Fade } from "react-awesome-reveal";
import { Link, useHistory } from "react-router-dom";

interface SocialBlockOnlineUserProps {
	user: ApiUpdateUser,
}

const SocialBlockOnlineUser = ({ user }: SocialBlockOnlineUserProps) => {
	const history = useHistory();
	let statusDescription: string | JSX.Element;
	let statusColor: string;

	if (user.status === ApiUserStatus.Regular)
		statusDescription = 'In main menu';
	else if (user.status === ApiUserStatus.InGame)
		statusDescription = <div>
			<span>In game</span>
			<button
				title='Watch game'
				className='social-block-user-watch-btn'
				onClick={ async () => {
					await axios.get('/games/watchGame', {
						params: { gamerLogin: user.login } ,
						headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
					});
					history.push('/game');
				} }
			>
				<FontAwesomeIcon icon={ faTv }/>
			</button>
		</div>;
	else if (user.status === ApiUserStatus.Offline)
		statusDescription = 'Offline';
	else
		statusDescription = 'Searching game';

	if (user.status === ApiUserStatus.InGame)
		statusColor = 'purple';
	else if (user.status === ApiUserStatus.Offline)
		statusColor = 'transparent';
	else
		statusColor = user.status;

	return (
		<li className='social-block-user'>
			<div
				className='social-block-user-img'
				style={ { backgroundImage: `url(${ user.url_avatar })` } }
			>
				<div className='user-status' style={ { backgroundColor: statusColor } }/>
			</div>
			<Link to={ `/users/${ user.login }` } className='social-block-user-username'>
				{ user.login }
			</Link>
			<div className='social-block-user-status-description'>
				{ statusDescription }
			</div>
		</li>
	);
};

const SocialBlockFriend = ({ user }: { user: ApiUserExpand }) => {
	let statusDescription: string | JSX.Element;
	let statusColor: string;

	statusDescription = 'Offline';
	statusColor = 'transparent';

	return (
		<li className='social-block-user'>
			<div
				className='social-block-user-img'
				style={ { backgroundImage: `url(${ user.url_avatar })` } }
			>
				<div className='user-status' style={ { backgroundColor: statusColor } }/>
			</div>
			<Link to={ `/users/${ user.login }` } className='social-block-user-username'>
				{ user.login }
			</Link>
			<div className='social-block-user-status-description'>
				{ statusDescription }
			</div>
		</li>
	);
};

interface SocialProps {
	onlineUsers: ApiUpdateUser[],
}

const Social = ({ onlineUsers }: SocialProps) => {
	const [friends, setFriends] = React.useState<ApiUserExpand[]>([]);
	const { currentUser } = useAppSelector(state => state.currentUser);
	const { allUsers } = useAppSelector(state => state.allUsers);

	React.useEffect(() => {
		const friendsLogins: string[] = [];
		const u = allUsers.find(usr => usr.login === currentUser.username);
		if (u) {
			for (let subscriber of u.subscribers)
				if (u.subscriptions.find(usr => usr.login === subscriber.login))
					friendsLogins.push(subscriber.login);
		}
		setFriends(allUsers.filter(usr => friendsLogins.indexOf(usr.login) !== -1));
	}, [allUsers, currentUser.username, onlineUsers]);

	return (
		<Fade
			cascade={ true }
			triggerOnce={ true }
			damping={ 0.3 }
		>
			<div className='main-block-title social-title'>
				<span>People</span>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>friends</span>
					<FontAwesomeIcon icon={ faCircle }/>
					<span>{ friends.length }</span>
				</div>
				<ul>
					{
						friends.map((user, i) => {
							const userInOnline = onlineUsers.find(usr => usr.id === user.id);
							if (userInOnline)
								return <SocialBlockOnlineUser key={ i } user={ userInOnline }/>;
							return <SocialBlockFriend key={ i } user={ user }/>;
						})
					}
				</ul>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>online</span>
					<FontAwesomeIcon icon={ faCircle }/>
					<span>{ onlineUsers.length }</span>
				</div>
				<ul>
					{
						onlineUsers.map((user, i) =>
							<SocialBlockOnlineUser key={ i } user={ user }/>
						)
					}
				</ul>
			</div>
		</Fade>
	);
};

export default Social;
