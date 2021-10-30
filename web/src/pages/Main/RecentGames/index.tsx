import './styles.scss';

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { ApiGame, ApiUpdateUser, ApiUser } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';

interface RecentGamesProps {
	currentUser: User,
	users: ApiUpdateUser[]
}

const RecentGames = ({ currentUser, users }: RecentGamesProps) => {
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);

	React.useEffect(() => {
		let isMounted = true;

		axios.get<ApiUser>('/users', { params: { login: currentUser.username, expand: true } })
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

	return (
		<div className='main-block recent-games'>
			<div className='main-block-title'>
				<span>Recent games</span>
				<button>
					<FontAwesomeIcon icon={faArrowRight}/>
				</button>
			</div>
			<div className='recent-games-legend'>
				<div className='recent-games-legend-enemy'>enemy</div>
				<div className='recent-games-legend-result'>result</div>
				<div className='recent-games-legend-score'>score</div>
				<div className='recent-games-legend-date'>date</div>
			</div>
			{
				gamesHistory.slice(0, 3).map((game, i) => {
					const enemyId = game.winnerId === currentUser.id ? game.loserId : game.winnerId;
					const enemy = users.find(user => user.id === enemyId);
					const enemyColor = enemy ? enemy.status : 'transparent';

					return (
						<div className='recent-game' key={i}>
							<div className='recent-game-enemy'>
								<div
									style={{ backgroundImage: `url(${enemy?.url_avatar})` }}
									className='recent-game-img'
								>
									<div className='user-status' style={{ backgroundColor: enemyColor }}/>
								</div>
								<div className='user-login'>{enemy?.login}</div>
							</div>
							{
								game.winnerId === currentUser.id
									? <div className='recent-game-win'>Win</div>
									: <div className='recent-game-lose'>Lose</div>
							}
							<div className='recent-game-score'>
								{`${game.leftScore} : ${game.rightScore}`}
							</div>
							<div className='recent-game-date'>
								{
									new Date(Date.parse(game.date)).toLocaleString('en-US', {
										year: 'numeric', month: 'numeric', day: 'numeric', minute: '2-digit', hour: '2-digit', hour12: false, timeZone: 'Europe/Moscow'
									}).replaceAll('/', '.')
								}
							</div>
						</div>
					);
				})
			}
		</div>
	);
};

export default RecentGames;
