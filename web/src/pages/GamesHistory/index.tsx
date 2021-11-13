import './styles.scss';

import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Header from "components/Header";
import { ApiGame, ApiUserExpand, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import moment from "moment";
import React from "react";
import { Fade } from "react-awesome-reveal";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";

export const GameTime = ({ date }: { date: string }) => {
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
	allUsers: ApiUserExpand[]
}

const GamesHistory = ({ currentUser, setCurrentUser, status, allUsers }: GamesHistoryProps) => {
	const params = useParams<{ login: string }>();
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiUserExpand>('/users', {
			params: { login: params.login, expand: true },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
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

	if (!currentUser.isAuthorized())
		return (
			<div>
				<Header
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
				/>
			</div>
		);

	return (
		<div>
			<Header
				currentUser={ currentUser }
				setCurrentUser={ setCurrentUser }
				status={ status }
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
											No games yet
											<FontAwesomeIcon icon={ faGamepad }/>
										</div>
									: gamesHistory.map((game, i) => {
										const loser = allUsers.find(usr => usr.id === game.loserId);
										const winner = allUsers.find(usr => usr.id === game.winnerId);
										const enemy = loser?.login === params.login ? winner : loser;
										const user = winner?.login === params.login ? winner : loser;

										const enemyColor = 'pink';

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
