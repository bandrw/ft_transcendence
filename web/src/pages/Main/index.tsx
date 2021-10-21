import './styles.scss';

import Game from "components/Game";
import Header from "components/Header";
import { SocketContext } from "context/socket";
import { GameSettings, UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>
}

const Main = ({ currentUser, setCurrentUser, status, setStatus }: MainProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			history.push('/login');
	}, [history, currentUser]);

	const [infoBoardContent, setInfoBoardContent] = React.useState<JSX.Element>(<div>Welcome to the game!</div>);
	const enemyRef = React.useRef<UpdateUser | null>(null);

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);

	const socket = React.useContext(SocketContext);

	const ballLaunchHandler = () => {
		console.log('[ballLaunchHandler]');
	};

	const gameSettingsHandler = (e: any) => {
		const gameSettings: GameSettings = JSON.parse(e.data);
		const data = {
			login: currentUser.username,
			id: gameSettings.id
		};
		setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
	};

	const updateUserHandler = (e: any) => {
		const data: UpdateUser = JSON.parse(e.data);
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

		const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/users/login?login=${currentUser.username}`);

		eventSource.addEventListener('updateUser', updateUserHandler);
		eventSource.addEventListener('enemy', enemyHandler);
		eventSource.addEventListener('gameIsReady', gameIsReadyHandler);
		eventSource.addEventListener('gameSettings', gameSettingsHandler);
		eventSource.addEventListener('ballLaunch', ballLaunchHandler);

		console.log('[Game] eventSource listeners added');

		return () => {
			eventSource.removeEventListener('updateUser', updateUserHandler);
			eventSource.removeEventListener('enemy', enemyHandler);
			eventSource.removeEventListener('gameIsReady', gameIsReadyHandler);
			eventSource.removeEventListener('gameSettings', gameSettingsHandler);
			eventSource.removeEventListener('ballLaunch', ballLaunchHandler);

			eventSource.close();
			console.log('[Game] eventSource listeners removed');
		};
	}, [currentUser]);

	return (
		<div className='main-container'>
			<Header
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
				status={status}
			/>
			{
				status !== UserStatus.InGame
					?	<FindGame
							currentUser={currentUser}
							status={status}
							setStatus={setStatus}
							enemyRef={enemyRef}
							enemyIsReady={enemyIsReady}
						/>
					:	<div className='main-tmp'>
							<div className='info-board'>
								{infoBoardContent}
							</div>
							<Game
								setInfoBoardContent={setInfoBoardContent}
								enemyInfo={enemyRef.current}
								currentUser={currentUser}
							/>
						</div>
			}
		</div>
	);
};

export default Main;
