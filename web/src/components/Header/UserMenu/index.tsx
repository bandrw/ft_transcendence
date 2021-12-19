import './styles.scss';

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {resetCurrentUser} from 'app/reducers/currentUserSlice';
import { removeToken } from 'app/token';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';

import { logout } from "../../../api/auth";

const UserMenu = () => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const dispatch = useAppDispatch();

	const logOut = () => {
		logout()
			.then(() => {
				dispatch(resetCurrentUser());
				removeToken();
			});
	};

	return (
		<Fade duration={250}>
			<div className="user-menu" onClick={(e) => e.stopPropagation()}>
				<div className="user-menu-username">{currentUser.username}</div>
				<Link to={`/users/${currentUser.username}`} className="user-menu-btn">
					Profile
				</Link>
				<div className="user-menu-btn user-menu-sign-out" onClick={logOut}>
					Log out
					<FontAwesomeIcon icon={faSignOutAlt} />
				</div>
			</div>
		</Fade>
	);
};

export default UserMenu;
