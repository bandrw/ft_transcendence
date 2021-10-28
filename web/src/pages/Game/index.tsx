import './styles.scss';

import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationWindow from "components/ConfirmationWindow";
import Header from "components/Header";
import { GameSettings, UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import GameCanvas from "pages/Game/GameCanvas";
import React from 'react';
import { useHistory } from "react-router-dom";

interface GameProps {
	enemyInfo: UpdateUser | null,
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	gameSettingsRef: React.MutableRefObject<GameSettings | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>
}

const Game = ({ enemyInfo, currentUser, setCurrentUser, gameSettingsRef, eventSourceRef, gameRef, setStatus }: GameProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!enemyInfo) {
			if (gameRef.current.runs && gameRef.current.interval)
				clearInterval(gameRef.current.interval);
			gameRef.current.runs = false;
			setStatus(UserStatus.Regular);
			history.push('/');
		}
	}, [history, enemyInfo, gameRef, setStatus]);

	const [exitWindowShown, setExitWindowShown] = React.useState(false);

	return (
		<div>
			<Header
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
				status={UserStatus.InGame}
				centerBlock={
					<div className='header-center'>
						<button
							className='header-center-exit-btn'
							onClick={() => setExitWindowShown(true)}
						>
							<FontAwesomeIcon icon={faDoorOpen}/>
							<span>EXIT</span>
						</button>
						{
							exitWindowShown &&
							<ConfirmationWindow
								title='Are you sure you want to exit the game?'
								okHandler={() => {
									if (gameRef.current.runs && gameRef.current.interval)
										clearInterval(gameRef.current.interval);
									gameRef.current.runs = false;
									setStatus(UserStatus.Regular);
									history.push('/');
								}}
								cancelHandler={() => setExitWindowShown(false)}
							/>
						}
					</div>
				}
			/>
			<GameCanvas
				enemyInfo={enemyInfo}
				currentUser={currentUser}
				eventSourceRef={eventSourceRef}
				gameSettingsRef={gameSettingsRef}
				gameRef={gameRef}
			/>
		</div>
	);
};

export default Game;
