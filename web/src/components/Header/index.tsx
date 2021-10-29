import './styles.scss';

import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserMenu from "components/Header/UserMenu";
import { UserStatus } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';

interface HeaderProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: UserStatus,
	centerBlock?: JSX.Element
}

const Header = ({ currentUser, setCurrentUser, status, centerBlock }: HeaderProps) => {
	const [userMenuShown, setUserMenuShown] = React.useState(false);

	return (
		<header>
			<div className='header-container'>
				<h1 style={{ letterSpacing: '2px' }}>
					FT
				</h1>

				{ centerBlock ? centerBlock : null }

				<div className='header-buttons'>
					<button className='notifications-btn'>
						<FontAwesomeIcon icon={faBell}/>
					</button>
					<button
						style={{ backgroundImage: `url(${currentUser.urlAvatar})` }}
						className='user-btn'
						onClick={() => setUserMenuShown(prev => !prev)}
						onMouseOver={() => setUserMenuShown(true)}
						onMouseLeave={() => setUserMenuShown(false)}
					>
						<div className='user-status' style={{ backgroundColor: status }}/>
						{
							userMenuShown &&
							<UserMenu
								currentUser={currentUser}
								setCurrentUser={setCurrentUser}
							/>
						}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
