import './styles.scss';

import Header from "components/Header";
import { SocketContext } from "context/socket";
import { GameLoop, GameSettings, UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

import RecentGames from "./RecentGames";
import Social from "./Social";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemyRef: React.MutableRefObject<UpdateUser | null>,
	gameLoopRef: React.MutableRefObject<GameLoop>,
	gameIdRef: React.MutableRefObject<number | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>
}

const Main = ({ currentUser, setCurrentUser, status, setStatus, enemyRef, gameLoopRef, gameIdRef, eventSourceRef }: MainProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			history.push('/login');
	}, [history, currentUser]);

	React.useEffect(() => {
		if (status === UserStatus.InGame)
			history.push('/game');
	}, [history, status]);

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);

	const socket = React.useContext(SocketContext);

	const gameSettingsHandler = (e: any) => {
		const gameSettings: GameSettings = JSON.parse(e.data);
		const data = {
			login: currentUser.username,
			id: gameSettings.id
		};
		gameIdRef.current = gameSettings.id;
		setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
	};

	const updateUserHandler = (e: any) => {
		const data: UpdateUser = JSON.parse(e.data);
		console.log('[updateUserHandler]', data);
		if (!enemyRef.current && status !== UserStatus.Regular) {
			setStatus(UserStatus.Regular);
		} else if (enemyRef.current && data.login === enemyRef.current.login && (data.status === UserStatus.Declined || data.status === UserStatus.Regular)) {
			setStatus(UserStatus.Regular);
		} else if (enemyRef.current && data.login === enemyRef.current.login && data.status === UserStatus.Accepted) {
			setEnemyIsReady(true);
		}
	};

	const enemyHandler = (e: any) => {
		enemyRef.current = JSON.parse(e.data);
		setStatus(UserStatus.FoundEnemy);
	};

	const gameIsReadyHandler = () => {
		setStatus(UserStatus.InGame);
	};

	useEffect(() => {
		if (!currentUser.isAuthorized())
			return;

		const eventSource = eventSourceRef.current;
		if (!eventSource)
			return ;

		eventSource.addEventListener('updateUser', updateUserHandler);
		eventSource.addEventListener('enemy', enemyHandler);
		eventSource.addEventListener('gameIsReady', gameIsReadyHandler);
		eventSource.addEventListener('gameSettings', gameSettingsHandler);

		console.log('[Main] eventSource listeners added');

		return () => {
			eventSource.removeEventListener('updateUser', updateUserHandler);
			eventSource.removeEventListener('enemy', enemyHandler);
			eventSource.removeEventListener('gameIsReady', gameIsReadyHandler);
			eventSource.removeEventListener('gameSettings', gameSettingsHandler);

			// eventSource.close();
			console.log('[Main] eventSource listeners removed');
		};
	}, [currentUser]);

	return (
		<div className='main'>
			<div className='main-container'>
				<Header
					currentUser={currentUser}
					setCurrentUser={setCurrentUser}
					status={status}
				/>
				<div className='main-center'>
					<FindGame
						currentUser={currentUser}
						status={status}
						setStatus={setStatus}
						enemyRef={enemyRef}
						enemyIsReady={enemyIsReady}
					/>
					<RecentGames/>
				</div>
				<div className='main-right'>
					<Social/>
				</div>
			</div>
		</div>
	);
};

export default Main;
