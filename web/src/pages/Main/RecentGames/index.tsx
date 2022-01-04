import './styles.scss';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useAppSelector } from 'hook/reduxHooks';
import { ApiGame, ApiUserExpand } from 'models/ApiTypes';
import { GameTime } from 'pages/GamesHistory';
import React from 'react';
import { Link } from 'react-router-dom';
import { getToken } from 'utils/token';

import EmptyGameHistory from "../../../components/EmptyGameHistory";
import {getTargetUser} from "../../../utils/getTargetUser";

const RecentGames = () => {
	const [gamesHistory, setGamesHistory] = React.useState<ApiGame[]>([]);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);

	React.useEffect(() => {
		let isMounted = true;

		axios
			.get<ApiUserExpand>('/users', {
				params: { login: currentUser.username, expand: '' },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((res) => {
				if (!isMounted) return;

				if (!res.data.wonGames || !res.data.lostGames) return;
				const games: ApiGame[] = [];
				for (const game of res.data.wonGames) games.push(game);
				for (const game of res.data.lostGames) games.push(game);
				setGamesHistory(games.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)));
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser.username]);

	if (gamesHistory.length === 0) {
		return <EmptyGameHistory />;
	}

	return (
		<div className="main-block recent-games">
			<div className="main-block-title">
				<span>Recent games</span>
				<Link className="recent-games-link" to={`/games/${currentUser.username}`}>
					<FontAwesomeIcon icon={faArrowRight} />
				</Link>
			</div>
			<div className="recent-games-legend">
				<div className="recent-games-legend-enemy">enemy</div>
				<div className="recent-games-legend-result">result</div>
				<div className="recent-games-legend-score">score</div>
				<div className="recent-games-legend-date">date</div>
			</div>
			{gamesHistory.slice(0, 3).map((game) => {
				const enemyId = game.winnerId === currentUser.id ? game.loserId : game.winnerId;
				const enemy = getTargetUser(allUsers, enemyId, 'id');

				return (
					<div className="recent-game" key={game.id}>
						<div className="recent-game-enemy">
							<div style={{ backgroundImage: `url(${enemy?.url_avatar})` }} className="recent-game-img" />
							<Link to={`/users/${enemy?.login}`} className="user-login">
								{enemy?.login}
							</Link>
						</div>
						{game.winnerId === currentUser.id ? (
							<div className="recent-game-win">Win</div>
						) : (
							<div className="recent-game-lose">Lose</div>
						)}
						<div className="recent-game-score">{`${game.leftScore} : ${game.rightScore}`}</div>
						<div className="recent-game-date">
							<GameTime date={game.date} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default RecentGames;
