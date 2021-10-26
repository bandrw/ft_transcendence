import './styles.scss';

import axios from "axios";
import Header from "components/Header";
import { SocketContext } from "context/socket";
import { GameSettings, GetAll, UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import RecentGames from "pages/Main/RecentGames";
import Social from "pages/Main/Social";
import React, { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemyRef: React.MutableRefObject<UpdateUser | null>,
	gameSettingsRef: React.MutableRefObject<GameSettings | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>
}

const Main = ({ currentUser, status, setStatus, enemyRef, gameSettingsRef, eventSourceRef }: MainProps) => {
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
	const [users, setUsers] = React.useState<UpdateUser[]>([]);
	const usersRef = React.useRef<UpdateUser[]>([]);

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return ;

		axios.get<GetAll[]>('/users/getAll')
			.then(res => {
				const fetchedUsers = res.data.map((usr: GetAll) => {
					return {
						login: usr.login,
						url_avatar: usr.url_avatar,
						status: UserStatus.Regular
					};
				});
				setUsers(fetchedUsers);
			})
			.catch();
	}, []);

	React.useEffect(() => {
		usersRef.current = users;
	}, [users]);

	const socket = React.useContext(SocketContext);

	const gameSettingsHandler = (e: any) => {
		const gameSettings: GameSettings = JSON.parse(e.data);
		gameSettingsRef.current = gameSettings;
		const data = {
			login: currentUser.username,
			id: gameSettings.id
		};
		setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
	};

	const updateUserHandler = (e: any) => {
		const data: UpdateUser = JSON.parse(e.data);

		const newUsers: UpdateUser[] = [];
		for (let i = 0; i < usersRef.current.length; ++i) {
			if (usersRef.current[i].login === data.login)
				newUsers.push(data);
			else
				newUsers.push(usersRef.current[i]);
		}
		setUsers(newUsers);

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

	const filteredUsers: UpdateUser[] = [];
	for (let i in users) {
		if (users[i].login !== currentUser.username)
			filteredUsers.push(users[i]);
	}

	return (
		<div className='main'>
			<div className='main-container'>
				<Header
					currentUser={currentUser}
					status={status}
				/>
				<div className='main-center'>
					<Fade
						triggerOnce={true}
						cascade={true}
						damping={0.15}
						style={{ animationFillMode: 'backwards' }}
					>
						<FindGame
							currentUser={currentUser}
							status={status}
							setStatus={setStatus}
							enemyRef={enemyRef}
							enemyIsReady={enemyIsReady}
						/>
						<RecentGames/>
					</Fade>
				</div>
				<div className='main-right'>
					<Fade
						triggerOnce={true}
						style={{ animationFillMode: 'backwards' }}
						className='main-block social'
					>
						<Social
							users={filteredUsers}
						/>
					</Fade>
				</div>
			</div>
		</div>
	);
};

export default Main;
