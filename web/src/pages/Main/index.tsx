import './styles.scss';

import Header from "components/Header";
import { SocketContext } from "context/socket";
import { ApiGameSettings, ApiOnlineUser, ApiUpdateUser, ApiUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import RecentGames from "pages/Main/RecentGames";
import Social from "pages/Main/Social";
import React, { useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>,
	enemyRef: React.MutableRefObject<ApiUpdateUser | null>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>,
	mainEventSourceInitializedRef: React.MutableRefObject<boolean>,
	allUsers: ApiUser[],
	onlineUsers: ApiOnlineUser[],
	setUsers: React.Dispatch<React.SetStateAction<ApiOnlineUser[]>>,
	usersRef: React.MutableRefObject<ApiOnlineUser[]>,
}

const Main: React.FC<MainProps> = ({
																		 currentUser,
																		 setCurrentUser,
																		 status,
																		 setStatus,
																		 enemyRef,
																		 gameSettingsRef,
																		 eventSourceRef,
																		 mainEventSourceInitializedRef,
																		 allUsers,
																		 onlineUsers,
																		 setUsers,
																		 usersRef
	}) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized()) {
			mainEventSourceInitializedRef.current = false;
			history.push('/login');
		}
	}, [history, currentUser, mainEventSourceInitializedRef]);

	React.useEffect(() => {
		if (status === ApiUserStatus.InGame)
			history.push('/game');
	}, [history, status]);

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);

	const socket = React.useContext(SocketContext);

	useEffect(() => {
		if (mainEventSourceInitializedRef.current)
			return ;

		if (!currentUser.isAuthorized())
			return;

		const eventSource = eventSourceRef.current;
		if (!eventSource)
			return ;

		const logoutHandler = (e: any) => {
			const data: ApiUpdateUser = JSON.parse(e.data);
			setUsers(usersRef.current.filter(usr => usr.login !== data.login));
		};

		const gameSettingsHandler = (e: any) => {
			const gameSettings: ApiGameSettings = JSON.parse(e.data);
			gameSettingsRef.current = gameSettings;

			if (gameSettings.leftPlayer.login !== currentUser.username && gameSettings.rightPlayer.login !== currentUser.username)
				return ;

			const data = {
				login: currentUser.username,
				id: gameSettings.id
			};
			setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
		};

		const updateUserHandler = (e: any) => {
			const data: ApiUpdateUser = JSON.parse(e.data);

			const newUsers: ApiOnlineUser[] = [];
			// Edit user
			for (let i = 0; i < usersRef.current.length; ++i) {
				if (usersRef.current[i].login === data.login)
					newUsers.push(data);
				else
					newUsers.push(usersRef.current[i]);
			}
			// Add new user
			if (usersRef.current.map((usr) => usr.login).indexOf(data.login) === -1)
				newUsers.push(data);

			setUsers(newUsers);

			if (!enemyRef.current && status !== ApiUserStatus.Regular) {
				setStatus(ApiUserStatus.Regular);
			} else if (enemyRef.current && data.login === enemyRef.current.login && (data.status === ApiUserStatus.Declined || data.status === ApiUserStatus.Regular)) {
				setStatus(ApiUserStatus.Regular);
			} else if (enemyRef.current && data.login === enemyRef.current.login && data.status === ApiUserStatus.Accepted) {
				setEnemyIsReady(true);
			}
		};

		const enemyHandler = (e: any) => {
			enemyRef.current = JSON.parse(e.data);
			setStatus(ApiUserStatus.FoundEnemy);
		};

		const gameIsReadyHandler = () => {
			setStatus(ApiUserStatus.InGame);
		};

		eventSource.addEventListener('logout_SSE', logoutHandler);
		eventSource.addEventListener('updateUser', updateUserHandler);
		eventSource.addEventListener('enemy', enemyHandler);
		eventSource.addEventListener('gameIsReady', gameIsReadyHandler);
		eventSource.addEventListener('gameSettings', gameSettingsHandler);
		mainEventSourceInitializedRef.current = true;

		console.log('[Main] eventSource listeners added');

		return () => {
			// if (mainEventSourceInitializedRef.current)
			// 	return ;
			//
			// eventSource.removeEventListener('logout_SSE', logoutHandler);
			// eventSource.removeEventListener('updateUser', updateUserHandler);
			// eventSource.removeEventListener('enemy', enemyHandler);
			// eventSource.removeEventListener('gameIsReady', gameIsReadyHandler);
			// eventSource.removeEventListener('gameSettings', gameSettingsHandler);
			// mainEventSourceInitializedRef.current = false;
			//
			// // eventSource.close();
			// console.log('[Main] eventSource listeners removed');
		};
	});

	const filteredUsers: ApiUpdateUser[] = [];
	for (let i in onlineUsers) {
		if (onlineUsers[i].login !== currentUser.username)
			filteredUsers.push(onlineUsers[i]);
	}

	return (
		<div className='main'>
			<div className='main-container'>
				<Header
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
				/>
				<div className='main-center'>
					<Fade
						triggerOnce={ true }
						style={ { position: 'relative', zIndex: 9 } }
					>
						<FindGame
							currentUser={ currentUser }
							status={ status }
							setStatus={ setStatus }
							enemyRef={ enemyRef }
							enemyIsReady={ enemyIsReady }
						/>
					</Fade>
					<Fade
						delay={ 100 }
						triggerOnce={ true }
						style={ { position: 'relative', zIndex: 8 } }
					>
						<RecentGames
							currentUser={ currentUser }
							allUsers={ allUsers }
						/>
					</Fade>
				</div>
				<div className='main-right'>
					<Fade
						delay={ 100 }
						triggerOnce={ true }
						className='main-block social'
					>
						<Social
							users={ filteredUsers }
							currentUser={ currentUser }
						/>
					</Fade>
				</div>
			</div>
		</div>
	);
};

export default Main;
