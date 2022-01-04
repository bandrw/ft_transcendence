import './styles.scss';

import { faEdit, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'hook/reduxHooks';
import { ApiGame, ApiUserExpand } from 'models/ApiTypes';
import FriendsList from 'pages/UserProfile/FriendsList';
import ListSection from 'pages/UserProfile/ListSection';
import UserEditWindow from 'pages/UserProfile/UserEditWindow';
import React from 'react';
import { useParams } from 'react-router-dom';

import GameList from "../../components/GameList";
import { SubscribeBtn } from "../../components/SubscribeBtn";
import { getTargetUser } from "../../utils/getTargetUser";

const UserProfile = () => {
	const params = useParams<{ login: string }>();
	const [user, setUser] = React.useState<ApiUserExpand | null>(null);
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);
	const [friends, setFriends] = React.useState<ApiUserExpand[]>([]);
	const [showEditWindow, setShowEditWindow] = React.useState<boolean>(false);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);

	React.useEffect(() => {
		const friendsLogins: string[] = [];
		const u = getTargetUser(allUsers, user?.login, 'login'); // allUsers.find((usr) => usr.login === user?.login);

		if (u) {
			for (const subscriber of u.subscribers)
				if (u.subscriptions.find((usr) => usr.login === subscriber.login)) friendsLogins.push(subscriber.login);
		}
		setFriends(allUsers.filter((usr) => friendsLogins.indexOf(usr.login) !== -1));
	}, [allUsers, user]);

	React.useEffect(() => {
		const usr = getTargetUser(allUsers, params.login, 'login'); // allUsers.find((u) => u.login === params.login);

		if (!usr) return;

		setUser(usr);
		const games: ApiGame[] = [];
		for (const game of usr.wonGames) games.push(game);
		for (const game of usr.lostGames) games.push(game);
		setGamesHistory(games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
	}, [allUsers, params.login]);

	// Click outside of EditWindow
	React.useEffect(() => {
		const windowClickHandler = () => {
			if (showEditWindow) setShowEditWindow(false);
		};

		window.addEventListener('click', windowClickHandler);

		return () => {
			window.removeEventListener('click', windowClickHandler);
		};
	}, [showEditWindow]);

	let winRate = '-';
	let gamesCount = '0';

	if (user) {
		if (user.lostGames.length + user.wonGames.length !== 0) {
			winRate = `${Math.round((100 * user.wonGames.length) / (user.lostGames.length + user.wonGames.length))} %`;
		}
		gamesCount = `${user.lostGames.length + user.wonGames.length}`;
	}

	const GameListComponent = <GameList gamesHistory={gamesHistory}/>;

	return (
		<div>
			<div className="user-profile-wrapper">
				<div className="user-profile">
					<div className="user-profile-info-img" style={{ backgroundImage: `url(${user?.url_avatar})` }} />
					<div className="user-profile-header-top">
						<div className="user-profile-header-username">{user?.login}</div>
						{user && user.login !== currentUser.username && (
							<SubscribeBtn currentUser={currentUser} targetLogin={user.login} allUsers={allUsers} />
						)}
						{user && user.login === currentUser.username && (
							<div className="user-profile-header__edit-wrapper">
								<button
									className="user-profile-header__edit-btn"
									onClick={() => setShowEditWindow((prev) => !prev)}
								>
									<FontAwesomeIcon icon={faEdit} />
								</button>
								{showEditWindow && <UserEditWindow />}
							</div>
						)}
					</div>
					<div className="user-profile-header">
						<div className="user-profile-header-section">
							<div className="user-profile-header-section-content">{friends.length}</div>
							<div className="user-profile-header-section-label">friends</div>
						</div>
						<div className="user-profile-header-section">
							<div className="user-profile-header-section-content">{winRate}</div>
							<div className="user-profile-header-section-label">win rate</div>
						</div>
						<div className="user-profile-header-section">
							<div className="user-profile-header-section-content">{gamesCount}</div>
							<div className="user-profile-header-section-label">games</div>
						</div>
						<div className="user-profile-header-section">
							<div className="user-profile-header-section-content">
								{user?.intraLogin ? (
									<a
										target="_blank"
										href={`https://profile.intra.42.fr/users/${user.intraLogin}`}
										rel="noreferrer"
									>
										{user.intraLogin}
										<FontAwesomeIcon icon={faExternalLinkAlt} />
									</a>
								) : (
									'-'
								)}
							</div>
							<div className="user-profile-header-section-label">intra profile</div>
						</div>
					</div>
					<div className="user-profile-content">
						<ListSection
							title="Latest games"
							linkTo={`/games/${user?.login}`}
							list={GameListComponent}
						/>
						 <div style={{ height: '50px' }} />
						 <FriendsList friends={friends} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
