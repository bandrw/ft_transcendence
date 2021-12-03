import './styles.scss';

import { faExternalLinkAlt, faGamepad, faUserCheck, faUserFriends, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "app/hooks";
import axios from "axios";
import CircleLoading from "components/CircleLoading";
import Header from "components/Header";
import { ApiGame, ApiUser, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import { GameTime } from "pages/GamesHistory";
import FriendsList from "pages/UserProfile/FriendsList";
import ListSection from "pages/UserProfile/ListSection";
import React from "react";
import { Link, useParams } from "react-router-dom";

enum SubscribeBtnState {
	Default,
	Subscribed,
	AcceptFriendship,
	InFriendship
}

interface GameItemProps {
	enemy?: ApiUser,
	game: ApiGame,
	user?: ApiUser
}

const GameItem = ({ enemy, game, user }: GameItemProps) => {
	// const statusColor = enemy ? enemy.status : 'transparent';
	const statusColor = 'pink';

	return (
		<div className='games-history-game'>
			<div className='games-history-enemy'>
				<div
					style={ { backgroundImage: `url(${ enemy?.url_avatar })` } }
					className='games-history-game-img'
				>
					<div className='games-history-user-status' style={ { backgroundColor: statusColor } }/>
				</div>
				<Link to={ `/users/${enemy?.login}` } className='games-history-user-login'>{ enemy?.login }</Link>
			</div>
			{
				game.winnerId === user?.id
					? <div className='games-history-win'>Win</div>
					: <div className='games-history-lose'>Lose</div>
			}
			<div className='games-history-game-score'>
				{ `${game.leftScore} : ${game.rightScore}` }
			</div>
			<div className='games-history-game-date'>
				<GameTime date={ game.date } />
			</div>
		</div>
	);
};

const SubscribeBtn = ({ currentUser, targetLogin, allUsers }: { currentUser: User, targetLogin: string, allUsers: ApiUserExpand[] }) => {
	const [subscribeBtnState, setSubscribeBtnState] = React.useState(SubscribeBtnState.Default);
	const [subscribeBtnLoading, setSubscribeBtnLoading] = React.useState(false);

	React.useEffect(() => {
		const currUser = allUsers.find(usr => usr.login === currentUser.username);
		if (!currUser)
			return ;

		if (!currUser.subscriptions) {
			console.log('[SubscribeBtn] subscriptions is undefined'); // todo: [remove if]
			return;
		}
		if (!currUser.subscribers) {
			console.log('[SubscribeBtn] subscribers is undefined');
			return;
		}

		if (currUser.subscriptions.find(s => s.login === targetLogin)) {
			if (currUser.subscribers.find(s => s.login === targetLogin))
				setSubscribeBtnState(SubscribeBtnState.InFriendship);
			else
				setSubscribeBtnState(SubscribeBtnState.Subscribed);
		} else if (currUser.subscribers.find(s => s.login === targetLogin)) {
			setSubscribeBtnState(SubscribeBtnState.AcceptFriendship);
		} else {
			setSubscribeBtnState(SubscribeBtnState.Default);
		}
	}, [allUsers, currentUser.username, targetLogin]);

	if (subscribeBtnLoading)
		return (
			<button
				className='user-profile-header-subscribe-btn'
			>
				<CircleLoading
					bgColor='#fff'
					width='35px'
					height='35px'
				/>
			</button>
		);

	if (subscribeBtnState === SubscribeBtnState.Default)
		return (
			<button
				className='user-profile-header-subscribe-btn user-profile-header-subscribe-btn-default'
				onClick={ () => {
					setSubscribeBtnLoading(true);
					axios.get('/users/subscribe', {
						params: { target: targetLogin },
						headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
					})
						.then(() => setSubscribeBtnState(SubscribeBtnState.Subscribed))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				} }
				title='Subscribe'
			>
				Subscribe
				<FontAwesomeIcon icon={ faUserPlus }/>
			</button>
		);

	if (subscribeBtnState === SubscribeBtnState.Subscribed)
		return (
			<button
				className='user-profile-header-subscribe-btn user-profile-header-subscribe-btn-subscribed'
				onClick={ () => {
					setSubscribeBtnLoading(true);
					axios.get('/users/unsubscribe', {
						params: { target: targetLogin },
						headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
					})
						.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				} }
				title='Unsubscribe'
			>
				Subscribed
				<FontAwesomeIcon icon={ faUserCheck }/>
			</button>
		);

	if (subscribeBtnState === SubscribeBtnState.AcceptFriendship)
		return (
			<button
				className='user-profile-header-subscribe-btn user-profile-header-subscribe-btn-accept'
				onClick={ () => {
					setSubscribeBtnLoading(true);
					axios.get('/users/subscribe', {
						params: { target: targetLogin },
						headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
					})
						.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				} }
				title='Subscribe'
			>
				Accept
				<FontAwesomeIcon icon={ faUserCheck }/>
			</button>
		);

	return (
		<button
			className='user-profile-header-subscribe-btn user-profile-header-subscribe-btn-friends'
			onClick={ () => {
				setSubscribeBtnLoading(true);
				axios.get('/users/unsubscribe', {
					params: { target: targetLogin },
					headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
				})
					.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
					.catch(() => {})
					.finally(() => setSubscribeBtnLoading(false));
			} }
			title='Unsubscribe'
		>
			Friend
			<FontAwesomeIcon icon={ faUserFriends }/>
		</button>
	);
};

const UserProfile = () => {
	const params = useParams<{ login: string }>();
	const [user, setUser] = React.useState<ApiUserExpand | null>(null);
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);
	const [friends, setFriends] = React.useState<ApiUserExpand[]>([]);
	const { currentUser } = useAppSelector(state => state.currentUser);
	const { allUsers } = useAppSelector(state => state.allUsers);

	React.useEffect(() => {
		const friendsLogins: string[] = [];
		const u = allUsers.find(usr => usr.login === user?.login);
		if (u) {
			for (let subscriber of u.subscribers)
				if (u.subscriptions.find(usr => usr.login === subscriber.login))
					friendsLogins.push(subscriber.login);
		}
		setFriends(allUsers.filter(usr => friendsLogins.indexOf(usr.login) !== -1));
	}, [allUsers, user]);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiUserExpand>('/users', {
			params: { login: params.login, expand: '' },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(res => {
				if (!isMounted)
					return ;
				setUser(res.data);
				if (!res.data.wonGames || !res.data.lostGames)
					return;
				const games: ApiGame[] = [];
				for (let game of res.data.wonGames)
					games.push(game);
				for (let game of res.data.lostGames)
					games.push(game);
				setGamesHistory(games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
			});

		return () => {
			isMounted = false;
		};
	}, [params.login]);

	if (!currentUser.isAuthorized())
		return (
			<div>
				<Header/>
			</div>
		);

	let winRate = '-';
	let gamesCount = '0';

	if (user) {
		if (user.lostGames.length + user.wonGames.length !== 0) {
			winRate = `${ Math.round(100 * user.wonGames.length / (user.lostGames.length + user.wonGames.length)) } %`;
		}
		gamesCount = `${ user.lostGames.length + user.wonGames.length }`;
	}

	return (
		<div>
			<Header/>
			<div className='user-profile-wrapper'>
				<div className='user-profile'>
					<div className='user-profile-info-img' style={ { backgroundImage: `url(${ user?.url_avatar })` } }/>
					<div className='user-profile-header-top'>
						<div className='user-profile-header-username'>{ user?.login }</div>
						{
							(user && user.login !== currentUser.username) &&
							<SubscribeBtn
								currentUser={ currentUser }
								targetLogin={ user.login }
								allUsers={ allUsers }
							/>
						}
					</div>
					<div className='user-profile-header'>
						<div className='user-profile-header-section'>
							<div className='user-profile-header-section-content'>{ friends.length }</div>
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
							linkTo={ `/games/${user?.login}` }
							list={
								gamesHistory.slice(0, 3).map(game => {
									const loser = allUsers.find(usr => usr.id === game.loserId);
									const winner = allUsers.find(usr => usr.id === game.winnerId);
									const enemy = loser?.login === params.login ? winner : loser;
									const user = winner?.login === params.login ? winner : loser;

									return <GameItem game={ game } user={ user } enemy={ enemy }/>;
								})
							}
							emptyListSubstitute={
								<div className='list-section-empty'>
									No games yet
									<FontAwesomeIcon icon={ faGamepad }/>
								</div>
							}
						/>
						<div style={ { height: '50px' } }/>
						<FriendsList friends={ friends }/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
