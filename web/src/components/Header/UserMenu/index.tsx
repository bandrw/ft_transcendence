import './styles.scss';

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { User } from "models/User";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

interface UserMenuProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>
}

const UserMenu = ({ currentUser, setCurrentUser } : UserMenuProps) => {
	const logOut = () => {
		axios.post('/users/logout', { user: { login: currentUser.username } }, {
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(() => {
				setCurrentUser(new User());
				localStorage.removeItem('access_token');
			});
	};

	return (
		<Fade
			duration={ 250 }
			className='user-menu-wrapper'
		>
			<div className='user-menu'>
				<div className='user-menu-username'>
					{ currentUser.username }
				</div>
				<Link to={ `/users/${currentUser.username}` } className='user-menu-btn'>
					Profile
				</Link>
				<div className='user-menu-btn user-menu-sign-out' onClick={ logOut }>
					Log out
					<FontAwesomeIcon icon={ faSignOutAlt }/>
				</div>
			</div>
		</Fade>
	);
};

export default UserMenu;
