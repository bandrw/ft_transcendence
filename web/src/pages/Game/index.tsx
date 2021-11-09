import './styles.scss';

import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationWindow from "components/ConfirmationWindow";
import Header from "components/Header";
import { ApiGameSettings, ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import GameCanvas from "pages/Game/GameCanvas";
import React from 'react';
import { Redirect, useHistory } from "react-router-dom";

interface GameProps {
	enemyInfo: ApiUpdateUser | null,
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>
}

const Game = ({ enemyInfo, currentUser, setCurrentUser, gameSettingsRef, gameRef, status, setStatus }: GameProps) => {
	const watchMode = (status !== ApiUserStatus.InGame);
	const history = useHistory();

	React.useEffect(() => {
		if (watchMode)
			return ;

		if (!enemyInfo) {
			gameRef.current.runs = false;
			setStatus(ApiUserStatus.Regular);
			history.push('/');
		}
	}, [history, enemyInfo, gameRef, setStatus, watchMode, currentUser]);

	const [exitWindowShown, setExitWindowShown] = React.useState(false);

	if (!currentUser.isAuthorized())
		return <Redirect to='/login'/>;

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
			{
				gameSettingsRef.current &&
				<GameCanvas
					watchMode={ watchMode }
					currentUser={ currentUser }
					gameSettings={ gameSettingsRef.current }
					gameRef={ gameRef }
					setStatus={ setStatus }
				/>
			}
		</div>
	);
};

export default Game;
