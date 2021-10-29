import './styles.scss';

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { User } from "models/User";
import React from "react";
import { Fade } from "react-awesome-reveal";
import { useHistory } from "react-router-dom";

interface UserMenuProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>
}

const UserMenu = ({ currentUser, setCurrentUser } : UserMenuProps) => {
	const history = useHistory();

	const logOut = () => {
		axios.post('/users/logout', { user: { login: currentUser.username } })
			.then(() => {
				setCurrentUser(new User());
				history.push('/login');
			});
	};

	return (
		<Fade
			duration={250}
			className='user-menu-wrapper'
		>
			<div className='user-menu'>
				<div className='user-menu-btn'>
					Profile
				</div>
				<div className='user-menu-btn user-menu-sign-out' onClick={logOut}>
					Log out
					<FontAwesomeIcon icon={faSignOutAlt}/>
				</div>
			</div>
		</Fade>
	);
};

export default UserMenu;
