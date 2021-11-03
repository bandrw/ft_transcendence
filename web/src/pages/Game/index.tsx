import './styles.scss';

import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationWindow from "components/ConfirmationWindow";
import Header from "components/Header";
import { ApiGameSettings, ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import GameCanvas from "pages/Game/GameCanvas";
import React from 'react';
import { useHistory } from "react-router-dom";

interface GameProps {
	enemyInfo: ApiUpdateUser | null,
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	// eventSourceRef: React.MutableRefObject<EventSource | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>
}

const Game = ({ enemyInfo, currentUser, setCurrentUser, gameSettingsRef, gameRef, status, setStatus }: GameProps) => {
	const watchMode = (status !== ApiUserStatus.InGame);
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			history.push('/login');

		if (watchMode)
			return ;

		if (!enemyInfo) {
			// if (gameRef.current.runs && gameRef.current.interval)
			// 	clearInterval(gameRef.current.interval);
			gameRef.current.runs = false;
			setStatus(ApiUserStatus.Regular);
			history.push('/');
		}
	}, [history, enemyInfo, gameRef, setStatus, watchMode, currentUser]);

	const [exitWindowShown, setExitWindowShown] = React.useState(false);

	// todo [handle watcher exit buttons]
	return (
		<div>
			<Header
				currentUser={ currentUser }
				setCurrentUser={ setCurrentUser }
				status={ ApiUserStatus.InGame }
				centerBlock={
					<div className='header-center'>
						<button
							className='header-center-exit-btn'
							onClick={ () => setExitWindowShown(true) }
						>
							<FontAwesomeIcon icon={ faDoorOpen }/>
							<span>EXIT</span>
						</button>
						{
							exitWindowShown &&
							<ConfirmationWindow
								title='Are you sure you want to exit the game?'
								okHandler={ () => {
									// if (gameRef.current.runs && gameRef.current.interval)
									// 	clearInterval(gameRef.current.interval);
									gameRef.current.runs = false;
									setStatus(ApiUserStatus.Regular);
									history.push('/');
								} }
								cancelHandler={ () => setExitWindowShown(false) }
							/>
						}
					</div>
				}
			/>
			<GameCanvas
				watchMode={ watchMode }
				currentUser={ currentUser }
				// eventSourceRef={ eventSourceRef }
				gameSettingsRef={ gameSettingsRef }
				gameRef={ gameRef }
				setStatus={ setStatus }
			/>
		</div>
	);
};

export default Game;
