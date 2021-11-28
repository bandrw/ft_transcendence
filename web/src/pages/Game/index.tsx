import './styles.scss';

import { useAppSelector } from "app/hooks";
import Header from "components/Header";
import { ApiGameSettings, ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import GameCanvas from "pages/Game/GameCanvas";
import React from 'react';
import { useHistory } from "react-router-dom";

interface GameProps {
	enemyInfo: ApiUpdateUser | null,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>
}

const Game = ({ enemyInfo, gameSettingsRef, gameRef, status, setStatus }: GameProps) => {
	const watchMode = (status !== ApiUserStatus.InGame);
	const history = useHistory();
	const { currentUser } = useAppSelector(state => state.currentUser);

	React.useEffect(() => {
		if (watchMode)
			return ;

		if (!enemyInfo) {
			gameRef.current.runs = false;
			setStatus(ApiUserStatus.Regular);
			history.push('/');
		}
	}, [history, enemyInfo, gameRef, setStatus, watchMode, currentUser]);

	// const [exitWindowShown, setExitWindowShown] = React.useState(false);

	if (!currentUser.isAuthorized())
		return (
			<div>
				<Header
					status={ status }
				/>
			</div>
		);

	// todo [handle watcher exit buttons]
	return (
		<div>
			<Header
				status={ ApiUserStatus.InGame }
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
