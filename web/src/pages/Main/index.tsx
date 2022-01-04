import './styles.scss';

import { useAppSelector } from 'hook/reduxHooks';
import { ApiUserStatus } from 'models/ApiTypes';
import FindGame from 'pages/Main/FindGame';
import Messenger from 'pages/Main/Messenger';
import RecentGames from 'pages/Main/RecentGames';
import Social from 'pages/Main/Social';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from 'react-router-dom';

const Main = () => {
	const history = useHistory();
	const { status } = useAppSelector((state) => state.status);

	// Redirect to /game
	React.useEffect(() => {
		if (status === ApiUserStatus.InGame) history.push('/game');
	});

	return (
		<div className="main">
			<div className="main-container">
				<div className="main-top">
					<div className="main-center">
						<Fade triggerOnce style={{ position: 'relative', zIndex: 9 }}>
							<FindGame />
						</Fade>
						<Fade delay={100} triggerOnce style={{ position: 'relative', zIndex: 8 }}>
							<RecentGames />
						</Fade>
					</div>
					<div className="main-right">
						<Fade delay={100} triggerOnce className="main-block social">
							<Social />
						</Fade>
					</div>
				</div>
				<Fade delay={400} triggerOnce>
					<Messenger />
				</Fade>
			</div>
		</div>
	);
};

export default Main;
