import './styles.scss';

import { faCircle, faTv } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { Fade } from "react-awesome-reveal";
import { Link, useHistory } from "react-router-dom";

interface SocialBlockUserProps {
	user: ApiUpdateUser,
	currentUser: User
}

const SocialBlockUser = ({ user, currentUser }: SocialBlockUserProps) => {
	const history = useHistory();
	let statusDescription: string | JSX.Element;

	if (user.status === ApiUserStatus.Regular)
		statusDescription = 'In main menu';
	else if (user.status === ApiUserStatus.InGame)
		statusDescription = <div>
			<span>In game</span>
			<button
				title='Watch game'
				className='social-block-user-watch-btn'
				onClick={ async () => {
					await axios.get('/games/watchGame', { params: { login: currentUser.username, gamerLogin: user.login } });
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

	let statusColor: string;
	if (user.status === ApiUserStatus.InGame)
		statusColor = 'purple';
	else if (user.status === ApiUserStatus.Offline)
		statusColor = 'transparent';
	else statusColor = user.status;

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
	users: ApiUpdateUser[],
	currentUser: User
}

const Social = ({ users, currentUser }: SocialProps) => {
	return (
		<Fade
			cascade={ true }
			triggerOnce={ true }
			damping={ 0.3 }
			// style={{ animationFillMode: 'backwards' }}
		>
			<div className='main-block-title social-title'>
				<span>People</span>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>friends</span>
					<FontAwesomeIcon icon={ faCircle }/>
					<span>{ 0 }</span>
				</div>
				<ul>
					{ /*{*/ }
					{ /*	users.map((user, i) =>*/ }
					{ /*		<SocialBlockUser key={i} user={user}/>*/ }
					{ /*	)*/ }
					{ /*}*/ }
				</ul>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>online</span>
					<FontAwesomeIcon icon={ faCircle }/>
					<span>{ users.length }</span>
				</div>
				<ul>
					{
						users.map((user, i) => {
							return <SocialBlockUser key={ i } user={ user } currentUser={ currentUser }/>;
						})
					}
					{ /*{*/ }
					{ /*	users.map((user, i) => {*/ }
					{ /*		return <SocialBlockUser key={i} user={user}/>;*/ }
					{ /*	})*/ }
					{ /*}*/ }
					{ /*{*/ }
					{ /*	users.map((user, i) => {*/ }
					{ /*		return <SocialBlockUser key={i} user={user}/>;*/ }
					{ /*	})*/ }
					{ /*}*/ }
				</ul>
			</div>
		</Fade>
	);
};

export default Social;
