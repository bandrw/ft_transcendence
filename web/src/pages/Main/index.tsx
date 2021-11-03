import './styles.scss';

import Header from "components/Header";
import { SocketContext } from "context/socket";
import { ApiGameSettings, ApiOnlineUser, ApiUpdateUser, ApiUser, ApiUserStatus } from "models/apiTypes";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import RecentGames from "pages/Main/RecentGames";
import Social from "pages/Main/Social";
import React  from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>,
	enemyRef: React.MutableRefObject<ApiUpdateUser | null>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
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
																		 allUsers,
																		 onlineUsers,
																		 setUsers,
																		 usersRef
	}) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized()) {
			history.push('/login');
		}
	}, [history, currentUser]);

	React.useEffect(() => {
		if (status === ApiUserStatus.InGame)
			history.push('/game');
	}, [history, status]);

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);
	const statusRef = React.useRef(status);

	const socket = React.useContext(SocketContext);

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return;

		const logoutHandler = (data: string) => {
			const logoutData: ApiUpdateUser = JSON.parse(data);
			setUsers(usersRef.current.filter(usr => usr.login !== logoutData.login));
		};

		const gameSettingsHandler = (e: string) => {
			const gameSettings: ApiGameSettings = JSON.parse(e);
			gameSettingsRef.current = gameSettings;

			// If watch mode, don't send start
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

			const newUsers: ApiOnlineUser[] = [];
			// Edit user
			for (let i = 0; i < usersRef.current.length; ++i) {
				if (usersRef.current[i].login === updateUserData.login)
					newUsers.push(updateUserData);
				else
					newUsers.push(usersRef.current[i]);
			}
			// Add new user
			if (usersRef.current.map((usr) => usr.login).indexOf(updateUserData.login) === -1)
				newUsers.push(updateUserData);

			setUsers(newUsers);

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

		socket.on('logout_SSE', data => logoutHandler(data));
		socket.on('updateUser', data => updateUserHandler(data));
		socket.on('enemy', data => enemyHandler(data));
		socket.on('gameIsReady', () => gameIsReadyHandler());
		socket.on('gameSettings', data => gameSettingsHandler(data));

		console.log('[Main] listeners added');

		return () => {
			// console.log('[Main] eventSource listeners removed');
		};
	}, [currentUser, setStatus, setUsers, socket, enemyRef, gameSettingsRef, usersRef]);

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
