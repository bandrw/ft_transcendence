import './styles.scss'

import React from 'react';
import { Link } from "react-router-dom";

import { User } from "../../classes/User";

interface HeaderProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
}

const Header = (props: HeaderProps) => {
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
					<div className='user-img'/>
					<div className='user-username'>
						{props.currentUser.username}
					</div>
					<button className='user-btn'/>
				</div>
			</div>
		</header>
	)
}

export default Header;
