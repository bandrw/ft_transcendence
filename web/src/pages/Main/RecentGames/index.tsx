import './styles.scss';

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type RecentGame = {
	enemy: {
		login: string,
		avatar: string
	},
	won: boolean,
	date: string
}

const RecentGames = () => {
	// tmp
	const recentGames: RecentGame[] = [
		{
			enemy: {
				login: 'admin3',
				avatar: 'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=ShirtScoopNeck&eyeType=Default&eyebrowType=UpDownNatural&facialHairColor=Red&facialHairType=BeardLight&hairColor=Black&hatColor=PastelOrange&mouthType=Sad&skinColor=Brown&topType=WinterHat1'
			},
			won: true,
			date: '20 october, 2021'
		},
		{
			enemy: {
				login: 'admin4',
				avatar: 'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=ShirtScoopNeck&eyeType=Default&eyebrowType=UpDownNatural&facialHairColor=Red&facialHairType=BeardLight&hairColor=Black&hatColor=PastelOrange&mouthType=Sad&skinColor=Brown&topType=WinterHat1'
			},
			won: true,
			date: '18 october, 2021'
		},
		{
			enemy: {
				login: 'admin5',
				avatar: 'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelBlue&clotheType=ShirtScoopNeck&eyeType=Default&eyebrowType=UpDownNatural&facialHairColor=Red&facialHairType=BeardLight&hairColor=Black&hatColor=PastelOrange&mouthType=Sad&skinColor=Brown&topType=WinterHat1'
			},
			won: false,
			date: '16 october, 2021'
		}
	];

	return (
		<div className='main-block recent-games'>
			<div className='recent-games-title'>
				<span>Recent games</span>
				<button>
					<FontAwesomeIcon icon={faArrowRight}/>
				</button>
			</div>
			{
				recentGames.map((game, i) =>
					<div className='recent-game' key={i}>
						<div
							style={{ backgroundImage: `url(${game.enemy.avatar})` }}
							className='recent-game-img'
						/>
						<div>{game.enemy.login}</div>
						{
							game.won
								? <div className='recent-game-win'>Win</div>
								: <div className='recent-game-lose'>Lose</div>
						}
						<div>{game.date}</div>
					</div>
				)
			}
		</div>
	);
};

export default RecentGames;
