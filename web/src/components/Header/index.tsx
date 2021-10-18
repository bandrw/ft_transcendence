import './styles.scss';

import { User } from "models/User";
import React from 'react';
import { Link } from "react-router-dom";

import { UserStatus } from "../../apiTypes/apiTypes";

interface HeaderProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >,
	status: UserStatus
}

const Header = ({ currentUser, setCurrentUser, status }: HeaderProps) => {
	return (
		<header>
			<div className='header-container'>
				<h1>
					ft_transcendence
				</h1>

				<div className='links'>
					<Link to='/'>
						Home
					</Link>
					<Link to='/chat'>
						Chat
					</Link>
				</div>

				<div className='user'>
					<div className='user-img' style={{ backgroundImage: `url(${currentUser.urlAvatar})` }}>
						<div className='user-status' style={{ backgroundColor: status }}/>
					</div>
					<div className='user-username'>
						{currentUser.username}
					</div>
					<button className='user-btn'/>
				</div>
			</div>
		</header>
	);
};

export default Header;
