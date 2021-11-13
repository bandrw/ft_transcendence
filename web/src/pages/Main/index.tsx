import './styles.scss';

import Header from "components/Header";
import { SocketContext } from "context/socket";
import { ApiGameSettings, ApiUpdateUser, ApiUserExpand, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import Messenger from "pages/Main/Messenger";
import RecentGames from "pages/Main/RecentGames";
import Social from "pages/Main/Social";
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>,
	enemyRef: React.MutableRefObject<ApiUpdateUser | null>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	allUsers: ApiUserExpand[],
	onlineUsers: ApiUpdateUser[],
	setOnlineUsers: React.Dispatch<React.SetStateAction<ApiUpdateUser[]>>,
	onlineUsersRef: React.MutableRefObject<ApiUpdateUser[]>,
}

const Main: React.FC<MainProps> = ({
																		 currentUser,
																		 setCurrentUser,
																		 status,
																		 setStatus,
																		 enemyRef,
																		 gameSettingsRef,
																		 allUsers,
																		 onlineUsers,
																		 setOnlineUsers,
																		 onlineUsersRef
	}) => {

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);
	const statusRef = React.useRef(status);
	const history = useHistory();

	const socket = React.useContext(SocketContext);

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return;

		const logoutHandler = (data: string) => {
			const logoutData: ApiUpdateUser = JSON.parse(data);
			setOnlineUsers(onlineUsersRef.current.filter(usr => usr.login !== logoutData.login));
		};

		const gameSettingsHandler = (e: string) => {
			const gameSettings: ApiGameSettings = JSON.parse(e);
			gameSettingsRef.current = gameSettings;

			// If watch mode is on, don't send start
			if (gameSettings.leftPlayer.login !== currentUser.username && gameSettings.rightPlayer.login !== currentUser.username)
				return ;

			const data = {
				login: currentUser.username,
				id: gameSettings.id
			};
			setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
		};

		const updateUserHandler = (data: string) => {
			const updateUserData: ApiUpdateUser = JSON.parse(data);

			setOnlineUsers(prev => {
				const newUsers: ApiUpdateUser[] = [];
				// Edit user
				for (let i = 0; i < prev.length; ++i) {
					if (prev[i].login === updateUserData.login)
						newUsers.push(updateUserData);
					else
						newUsers.push(prev[i]);
				}
				// Add new user
				if (prev.map((usr) => usr.login).indexOf(updateUserData.login) === -1)
					newUsers.push(updateUserData);
				return newUsers;
			});

			if (!enemyRef.current && statusRef.current !== ApiUserStatus.Regular) {
				setStatus(ApiUserStatus.Regular);
			} else if (enemyRef.current && updateUserData.login === enemyRef.current.login && (updateUserData.status === ApiUserStatus.Declined || updateUserData.status === ApiUserStatus.Regular)) {
				setStatus(ApiUserStatus.Regular);
			} else if (enemyRef.current && updateUserData.login === enemyRef.current.login && updateUserData.status === ApiUserStatus.Accepted) {
				setEnemyIsReady(true);
			}
		};

		const enemyHandler = (e: string) => {
			enemyRef.current = JSON.parse(e);
			setStatus(ApiUserStatus.FoundEnemy);
		};

		const gameIsReadyHandler = () => {
			setStatus(ApiUserStatus.InGame);
		};

		socket.on('logout', logoutHandler);
		socket.on('updateUser', updateUserHandler);
		socket.on('enemy', enemyHandler);
		socket.on('gameIsReady', gameIsReadyHandler);
		socket.on('gameSettings', gameSettingsHandler);

		return () => {
			socket.off('logout', logoutHandler);
			socket.off('updateUser', updateUserHandler);
			socket.off('enemy', enemyHandler);
			socket.off('gameIsReady', gameIsReadyHandler);
			socket.off('gameSettings', gameSettingsHandler);
		};

	}, [currentUser, setStatus, setOnlineUsers, socket, enemyRef, gameSettingsRef, onlineUsersRef]);

	React.useEffect(() => {
		if (status === ApiUserStatus.InGame)
			history.push('/game');
	});

	if (!currentUser.isAuthorized())
		return (
			<div className='main'>
				<div className='main-container'>
					<Header
						currentUser={ currentUser }
						setCurrentUser={ setCurrentUser }
						status={ status }
					/>
				</div>
			</div>
		);

	return (
		<div className='main'>
			<div className='main-container'>
				<Header
					currentUser={ currentUser }
					setCurrentUser={ setCurrentUser }
					status={ status }
				/>
				<div className='main-top'>
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
								onlineUsers={ onlineUsers.filter(usr => usr.login !== currentUser.username) }
								currentUser={ currentUser }
								allUsers={ allUsers }
							/>
						</Fade>
					</div>
				</div>
				<Fade
					delay={ 400 }
					triggerOnce={ true }
				>
					<Messenger
						currentUser={ currentUser }
						allUsers={ allUsers }
					/>
				</Fade>
			</div>
		</div>
	);
};

export default Main;
