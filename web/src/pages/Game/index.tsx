import './styles.scss';

import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStatus } from "app/reducers/statusSlice";
import Header from "components/Header";
import { ApiGameSettings, ApiUpdateUser, ApiUserStatus } from "models/ApiTypes";
import GameCanvas from "pages/Game/GameCanvas";
import React from 'react';
import { useHistory } from "react-router-dom";

interface GameProps {
	enemyInfo: ApiUpdateUser | null,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
}

const Game = ({ enemyInfo, gameSettingsRef, gameRef }: GameProps) => {
	const history = useHistory();
	const { status } = useAppSelector(state => state.status);
	const dispatch = useAppDispatch();

	const watchMode = (status !== ApiUserStatus.InGame);

	React.useEffect(() => {
		if (watchMode)
			return ;

		if (!enemyInfo) {
			gameRef.current.runs = false;
			dispatch(setStatus(ApiUserStatus.Regular));
			history.push('/');
		}
	}, [history, enemyInfo, gameRef, watchMode, dispatch]);

	// todo [handle watcher exit buttons]
	return (
		<div>
			<Header/>
			{
				gameSettingsRef.current &&
				<GameCanvas
					watchMode={ watchMode }
					gameSettings={ gameSettingsRef.current }
					gameRef={ gameRef }
				/>
			}
		</div>
	);
};

export default Game;
