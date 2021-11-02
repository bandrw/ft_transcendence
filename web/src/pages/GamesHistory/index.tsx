import './styles.scss';

import { faGamepad, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Header from "components/Header";
import { ApiGame, ApiOnlineUser, ApiUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import moment from "moment";
import React from "react";
import { Fade } from "react-awesome-reveal";
import Moment from "react-moment";
import { Link, useHistory, useParams } from "react-router-dom";

export const GameTime = ({ date }: { date: number }) => {
	const now = moment().format('DD.MM.YYYY');
	const gameDateDay = moment(date).format('DD.MM.YYYY');
	const yesterdayDay = moment().subtract(1, 'days').format('DD.MM.YYYY');
	const gameDateTime = moment(date).format('HH:mm');

	if (gameDateDay === now)
		return (
			<div>{ `Today, ${gameDateTime}` }</div>
		);
	if (gameDateDay === yesterdayDay)
		return (
			<div>{ `Yesterday, ${gameDateTime}` }</div>
		);
	return (
		<Moment
			format='MM.DD.YYYY, HH:mm'
			date={ date }
		/>
	);
};

interface GamesHistoryProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	users: ApiOnlineUser[]
}

const GamesHistory = ({ currentUser, setCurrentUser, status, users }: GamesHistoryProps) => {
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
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiUser>('/users', { params: { login: params.login, expand: true } })
			.then(res => {
				if (!isMounted)
					return;

				if (!res.data.wonGames || !res.data.lostGames)
					return;
				const games: ApiGame[] = [];
				for (let i in res.data.wonGames)
					games.push(res.data.wonGames[i]);
				for (let i in res.data.lostGames)
					games.push(res.data.lostGames[i]);
				setGamesHistory(games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser.username, params.login]);

	return (
		<div>
			<Header
				currentUser={ currentUser }
				setCurrentUser={ setCurrentUser }
				status={ status }
				centerBlock={
					<div className='header-center'>
						<div className='games-history-header'>
							<Link className='home-link' to='/'>
								<FontAwesomeIcon icon={ faHome }/>
								Go home
							</Link>
						</div>
					</div>
				}
			/>
			<div className='games-history-wrapper'>
				<Fade className='games-history'>
					<div>
						<h1>{ `Games history with ${params.login}` }</h1>
						<div className='games-history-games main-block'>
							<div className='games-history-legend'>
								<div className='games-history-legend-enemy'>enemy</div>
								<div className='games-history-legend-result'>result</div>
								<div className='games-history-legend-score'>score</div>
								<div className='games-history-legend-date'>date</div>
							</div>
							{
								gamesHistory.length === 0
									? <div className='recent-games-empty'>
											You have no games yet
											<FontAwesomeIcon icon={ faGamepad }/>
										</div>
									: gamesHistory.map((game, i) => {
											const enemyId = game.winnerId === currentUser.id ? game.loserId : game.winnerId;
											const enemy = users.find(user => user.id === enemyId);
											const enemyColor = enemy ? enemy.status : 'transparent';

											return (
												<div className='games-history-game' key={ i }>
													<div className='games-history-enemy'>
														<div
															style={ { backgroundImage: `url(${enemy?.url_avatar})` } }
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
										})
							}
						</div>
					</div>
				</Fade>
			</div>
		</div>
	);
};

export default GamesHistory;
