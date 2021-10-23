import './styles.scss';

import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from "models/User";
import React from 'react';

import { UserStatus } from "../../models/apiTypes";

interface HeaderProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >,
	status: UserStatus
}

const Header = ({ currentUser, setCurrentUser, status }: HeaderProps) => {
	return (
		<header>
			<div className='header-container'>
				<h1 style={{ letterSpacing: '2px' }}>
					FT
				</h1>

				{/*<div className='links'>*/}
				{/*	<Link to='/'>*/}
				{/*		Home*/}
				{/*	</Link>*/}
				{/*	<Link to='/chat'>*/}
				{/*		Chat*/}
				{/*	</Link>*/}
				{/*</div>*/}

				<div className='header-buttons'>
					<button className='notifications-btn'>
						<FontAwesomeIcon icon={faBell}/>
					</button>
					<button
						style={{ backgroundImage: `url(${currentUser.urlAvatar})` }}
						className='user-btn'
					>
						<div className='user-status' style={{ backgroundColor: status }}/>
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
