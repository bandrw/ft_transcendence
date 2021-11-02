import './styles.scss';

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Header from "components/Header";
import { ApiFetchedUser, ApiGame, ApiOnlineUser, ApiUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import { GameTime } from "pages/GamesHistory";
import ListSection from "pages/UserProfile/ListSection";
import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";

interface GameItemProps {
	enemy?: ApiFetchedUser,
	game: ApiGame,
	currentUser: User
}

const GameItem = ({ enemy, game, currentUser }: GameItemProps) => {
	const enemyColor = enemy ? enemy.status : 'transparent';

	return (
		<div className='games-history-game'>
			<div className='games-history-enemy'>
				<div
					style={ { backgroundImage: `url(${ enemy?.url_avatar })` } }
					className='games-history-game-img'
				>
					<div className='games-history-user-status' style={ { backgroundColor: enemyColor } }/>
				</div>
				<Link to={ `/users/${enemy?.login}` } className='games-history-user-login'>{ enemy?.login }</Link>
			</div>
			{
				game.winnerId === currentUser.id
					? <div className='games-history-win'>Win</div>
					: <div className='games-history-lose'>Lose</div>
			}
			<div className='games-history-game-score'>
				{ `${game.leftScore} : ${game.rightScore}` }
			</div>
			<div className='games-history-game-date'>
				<GameTime date={ Date.parse(game.date) } />
			</div>
		</div>
	);
};

interface UserProfileProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	users: ApiOnlineUser[]
}

const UserProfile = ({ currentUser, setCurrentUser, status, users }: UserProfileProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized()) {
			history.push('/login');
		}
	}, [history, currentUser]);

	React.useEffect(() => {
		if (status === ApiUserStatus.InGame)
			history.push('/game');
	}, [history, status]);

	const params = useParams<{ login: string }>();
	const [user, setUser] = React.useState<ApiUser | null>(null);
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);

	React.useEffect(() => {
		axios.get<ApiUser>('/users', { params: { login: params.login, expand: true } })
			.then(res => {
				setUser(res.data);

				if (!res.data.wonGames || !res.data.lostGames)
					return;
				const games: ApiGame[] = [];
				for (let i in res.data.wonGames)
					games.push(res.data.wonGames[i]);
				for (let i in res.data.lostGames)
					games.push(res.data.lostGames[i]);
				setGamesHistory(games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
			});
	}, [params.login]);

	let winRate = '-';
	let gamesCount = '0';

	if (user) {
		if (user.lostGames && user.wonGames) {
			if (user.lostGames.length + user.wonGames.length !== 0) {
				winRate = `${ Math.round(100 * user.wonGames.length / (user.lostGames.length + user.wonGames.length)) } %`;
			}
			gamesCount = `${ user.lostGames.length + user.wonGames.length }`;
		}
	}

	return (
		<div>
			<Header
				currentUser={ currentUser }
				setCurrentUser={ setCurrentUser }
				status={ status }
			/>
			<div className='user-profile-wrapper'>
				<div className='user-profile'>
					<div className='user-profile-info-img' style={ { backgroundImage: `url(${ user?.url_avatar })` } }/>
					<div className='user-profile-header-username'>{ user?.login }</div>
					<div className='user-profile-header'>
						<div className='user-profile-header-section'>
							<div className='user-profile-header-section-content'>{ 10 }</div>
							<div className='user-profile-header-section-label'>friends</div>
						</div>
						<div className='user-profile-header-section'>
							<div className='user-profile-header-section-content'>{ winRate }</div>
							<div className='user-profile-header-section-label'>win rate</div>
						</div>
						<div className='user-profile-header-section'>
							<div className='user-profile-header-section-content'>{ gamesCount }</div>
							<div className='user-profile-header-section-label'>games</div>
						</div>
						{ /*<div className='user-profile-header-section'>*/ }
						{ /*	<div className='user-profile-header-section-content'>{ `October, 31` }</div>*/ }
						{ /*	<div className='user-profile-header-section-label'>member since</div>*/ }
						{ /*</div>*/ }
						<div className='user-profile-header-section'>
							<div className='user-profile-header-section-content'>
								{
									user?.intraLogin
										? <a
												target='_blank'
												href={ `https://profile.intra.42.fr/users/${ user.intraLogin }` }
												rel="noreferrer"
											>
												{ user.intraLogin }
												<FontAwesomeIcon icon={ faExternalLinkAlt }/>
											</a>
										: '-'
								}
							</div>
							<div className='user-profile-header-section-label'>intra profile</div>
						</div>
					</div>
					<div className='user-profile-content'>
						<ListSection
							title='Latest games'
							list={
								gamesHistory.map(game => {
								const enemyId = game.winnerId === currentUser.id ? game.loserId : game.winnerId;
								const enemy = users.find(user => user.id === enemyId);

								return <GameItem game={ game } currentUser={ currentUser } enemy={ enemy }/>;
							}) }
						/>
						<div style={ { height: '50px' } }/>
						<ListSection
							title='Friends'
							list={ [] }
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
