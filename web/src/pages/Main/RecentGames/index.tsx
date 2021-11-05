import './styles.scss';

import { faArrowRight, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { ApiGame, ApiUserExpand } from "models/apiTypes";
import { User } from "models/User";
import { GameTime } from "pages/GamesHistory";
import React from 'react';
import { Link } from "react-router-dom";

interface RecentGamesProps {
	currentUser: User,
	allUsers: ApiUserExpand[]
}

const RecentGames = ({ currentUser, allUsers }: RecentGamesProps) => {
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiUserExpand>('/users', { params: { login: currentUser.username, expand: true } })
			.then(res => {
				if (!isMounted)
					return ;

				if (!res.data.wonGames || !res.data.lostGames)
					return ;
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
	}, [currentUser.username]);

	if (gamesHistory.length === 0)
		return (
			<div className='main-block recent-games'>
				<div className='main-block-title'>
					<span>Recent games</span>
					<Link className='recent-games-link' to={ `/games/${currentUser.username}` }>
						<FontAwesomeIcon icon={ faArrowRight }/>
					</Link>
				</div>
				<div className='recent-games-empty'>
					You have no games yet
					<FontAwesomeIcon icon={ faGamepad }/>
				</div>
			</div>
		);

	return (
		<div className='main-block recent-games'>
			<div className='main-block-title'>
				<span>Recent games</span>
				<Link className='recent-games-link' to={ `/games/${currentUser.username}` }>
					<FontAwesomeIcon icon={ faArrowRight }/>
				</Link>
			</div>
			<div className='recent-games-legend'>
				<div className='recent-games-legend-enemy'>enemy</div>
				<div className='recent-games-legend-result'>result</div>
				<div className='recent-games-legend-score'>score</div>
				<div className='recent-games-legend-date'>date</div>
			</div>
			{
				gamesHistory.slice(0, 3).map((game, i) => {
					const enemyId = (game.winnerId === currentUser.id ? game.loserId : game.winnerId);
					const enemy = allUsers.find(user => (user.id === enemyId));
					// const enemyColor = enemy ? enemy.status : 'transparent';
					const enemyColor = 'pink';

					return (
						<div className='recent-game' key={ i }>
							<div className='recent-game-enemy'>
								<div
									style={ { backgroundImage: `url(${enemy?.url_avatar})` } }
									className='recent-game-img'
								>
									<div className='user-status' style={ { backgroundColor: enemyColor } }/>
								</div>
								<Link to={ `/users/${enemy?.login}` } className='user-login'>{ enemy?.login }</Link>
							</div>
							{
								game.winnerId === currentUser.id
									? <div className='recent-game-win'>Win</div>
									: <div className='recent-game-lose'>Lose</div>
							}
							<div className='recent-game-score'>
								{ `${game.leftScore} : ${game.rightScore}` }
							</div>
							<div className='recent-game-date'>
								<GameTime date={ game.date }/>
							</div>
						</div>
					);
				})
			}
		</div>
	);
};

export default RecentGames;
