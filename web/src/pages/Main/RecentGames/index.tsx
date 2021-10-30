import './styles.scss';

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { GetAll } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';

type RecentGame = {
	id: number,
	winner: GetAll,
	loser: GetAll,
	leftScore: number,
	rightScore: number,
	date: string
}

interface RecentGamesProps {
	currentUser: User
}

const RecentGames = ({ currentUser }: RecentGamesProps) => {
	const [gamesHistory, setGamesHistory] = React.useState<RecentGame[]>([]);
	React.useEffect(() => {
		let isMounted = true;

		axios.get<RecentGame[]>('/games')
			.then(res => {
				if (!isMounted)
					return ;

				setGamesHistory(res.data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className='main-block recent-games'>
			<div className='main-block-title'>
				<span>Recent games</span>
				<button>
					<FontAwesomeIcon icon={faArrowRight}/>
				</button>
			</div>
			{
				gamesHistory.map((game, i) => {
					const enemyColor = 'blue';
					const enemy = game.winner.login === currentUser.username ? game.loser : game.winner;

					return (
						<div className='recent-game' key={i}>
							<div className='recent-game-enemy'>
								<div
									style={{ backgroundImage: `url(${enemy.url_avatar})` }}
									className='recent-game-img'
								>
									<div className='user-status' style={{ backgroundColor: enemyColor }}/>
								</div>
								<div className='user-login'>{enemy.login}</div>
							</div>
							{
								game.winner.login === currentUser.username
									? <div className='recent-game-win'>Win</div>
									: <div className='recent-game-lose'>Lose</div>
							}
							<div className='recent-game-score'>
								{`${game.leftScore} : ${game.rightScore}`}
							</div>
							<div>
								{
									new Date(Date.parse(game.date)).toLocaleString('en-US', {
										year: 'numeric', month: 'numeric', day: 'numeric', minute: '2-digit', hour: '2-digit', hour12: false, timeZone: 'Europe/Moscow'
									})
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
