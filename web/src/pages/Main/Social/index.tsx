import './styles.scss';

import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UpdateUser, UserStatus } from "models/apiTypes";
import React from 'react';
import { Fade } from "react-awesome-reveal";

interface SocialBlockUserProps {
	user: UpdateUser
}

const SocialBlockUser = ({ user }: SocialBlockUserProps) => {
	let statusDescription = '';
	if (user.status === UserStatus.Regular)
		statusDescription = 'In main menu';
	else if (user.status === UserStatus.InGame)
		statusDescription = 'In game';
	else if (user.status === UserStatus.Offline)
		statusDescription = 'Offline';
	else
		statusDescription = 'Searching game';

	return (
		<li className='social-block-user'>
			<div
				className='social-block-user-img'
				style={{ backgroundImage: `url(${user.url_avatar})` }}
			>
				<div className='user-status' style={{ backgroundColor: user.status }}/>
			</div>
			<div className='social-block-user-username'>
				{user.login}
			</div>
			<div className='social-block-user-status-description'>
				{statusDescription}
			</div>
		</li>
	);
};

interface SocialProps {
	users: UpdateUser[]
}

const Social = ({ users }: SocialProps) => {
	return (
		<Fade
			cascade={true}
			triggerOnce={true}
			damping={0.4}
			// style={{ animationFillMode: 'backwards' }}
		>
			<div className='main-block-title social-title'>
				<span>People</span>
				<button>
					<FontAwesomeIcon icon={faArrowRight}/>
				</button>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>FRIENDS</span>
					<FontAwesomeIcon icon={faCircle}/>
					<span>{0}</span>
				</div>
				<ul>
					{/*{*/}
					{/*	users.map((user, i) =>*/}
					{/*		<SocialBlockUser key={i} user={user}/>*/}
					{/*	)*/}
					{/*}*/}
				</ul>
			</div>
			<div className='social-block'>
				<div className='social-block-title'>
					<span>ONLINE</span>
					<FontAwesomeIcon icon={faCircle}/>
					<span>{users.length}</span>
				</div>
				<ul>
					{
						users.map((user, i) => {
							return <SocialBlockUser key={i} user={user}/>;
						})
					}
					{/*{*/}
					{/*	users.map((user, i) => {*/}
					{/*		return <SocialBlockUser key={i} user={user}/>;*/}
					{/*	})*/}
					{/*}*/}
					{/*{*/}
					{/*	users.map((user, i) => {*/}
					{/*		return <SocialBlockUser key={i} user={user}/>;*/}
					{/*	})*/}
					{/*}*/}
				</ul>
			</div>
		</Fade>
	);
};

export default Social;
