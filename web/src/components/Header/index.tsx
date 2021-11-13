import './styles.scss';

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserMenu from "components/Header/UserMenu";
import { ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { Link,useHistory } from "react-router-dom";

interface HeaderProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	centerBlock?: JSX.Element
}

const Header = ({ currentUser, setCurrentUser, status, centerBlock }: HeaderProps) => {
	const history = useHistory();
	const [userMenuShown, setUserMenuShown] = React.useState(false);

	if (history.location.pathname !== '/')
		return (
			<header>
				<div className='header-container'>
					<button onClick={ () => history.goBack() } className='header-back-btn'>
						<FontAwesomeIcon icon={ faChevronLeft }/>
					</button>

					{
						centerBlock
						? centerBlock
						: <Link to='/'>
								<h1 style={ { letterSpacing: '2px' } }>
									FT
								</h1>
							</Link>
					}

					<div className='header-buttons'>
						<button className='notifications-btn'>
							<FontAwesomeIcon icon={ faBell }/>
						</button>
						<button
							style={ { backgroundImage: `url(${currentUser.urlAvatar})` } }
							className='user-btn'
							onClick={ () => setUserMenuShown(prev => !prev) }
							onMouseOver={ () => setUserMenuShown(true) }
							onMouseLeave={ () => setUserMenuShown(false) }
						>
							<div className='user-status' style={ { backgroundColor: status } }/>
							{
								userMenuShown &&
								<UserMenu
									currentUser={ currentUser }
									setCurrentUser={ setCurrentUser }
								/>
							}
						</button>
					</div>
				</div>
			</header>
		);

	return (
		<header>
			<div className='header-container'>
				<Link to='/'>
					<h1 style={ { letterSpacing: '2px' } }>
						FT
					</h1>
				</Link>

				{ centerBlock ? centerBlock : null }

				<div className='header-buttons'>
					<button className='notifications-btn'>
						<FontAwesomeIcon icon={ faBell }/>
					</button>
					<button
						style={ { backgroundImage: `url(${currentUser.urlAvatar})` } }
						className='user-btn'
						onMouseOver={ () => setUserMenuShown(true) }
						onMouseLeave={ () => setUserMenuShown(false) }
					>
						<div className='user-status' style={ { backgroundColor: status } }/>
						{
							userMenuShown &&
							<UserMenu
								currentUser={ currentUser }
								setCurrentUser={ setCurrentUser }
							/>
						}
					</button>
				</div>
			</div>
		</header>
	);
};

export default Header;
