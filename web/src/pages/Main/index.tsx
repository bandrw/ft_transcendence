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
	setCurrentUser: React.Dispatch<React.SetStateAction<User>>,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemyRef: React.MutableRefObject<UpdateUser | null>,
	gameSettingsRef: React.MutableRefObject<GameSettings | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>,
	mainEventSourceInitializedRef: React.MutableRefObject<boolean>
}

const Main: React.FC<MainProps> = ({
																		 currentUser,
																		 setCurrentUser,
																		 status,
																		 setStatus,
																		 enemyRef,
																		 gameSettingsRef,
																		 eventSourceRef,
																		 mainEventSourceInitializedRef
	}) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized()) {
			mainEventSourceInitializedRef.current = false;
			history.push('/login');
		}
	}, [history, currentUser, mainEventSourceInitializedRef]);

	React.useEffect(() => {
		if (status === UserStatus.InGame)
			history.push('/game');
	}, [history, status]);

	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);
	const [users, setUsers] = React.useState<UpdateUser[]>([]);
	const usersRef = React.useRef<UpdateUser[]>([]);

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		axios.get<GetAll[]>('/users/getAll')
			.then(res => {
				if (!isMounted)
					return ;

				const fetchedUsers = res.data.map((usr: GetAll) => {
					return {
						login: usr.login,
						url_avatar: usr.url_avatar,
						status: UserStatus.Regular
					};
				});
				setUsers(fetchedUsers);
			});

		return () => {
			isMounted = false;
		};
	}, [currentUser]);

	React.useEffect(() => {
		usersRef.current = users;
	}, [users]);

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
			const data: UpdateUser = JSON.parse(e.data);
			setUsers(usersRef.current.filter(usr => usr.login !== data.login));
		};

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

		eventSource.addEventListener('logout_SSE', logoutHandler);
		eventSource.addEventListener('updateUser', updateUserHandler);
		eventSource.addEventListener('enemy', enemyHandler);
		eventSource.addEventListener('gameIsReady', gameIsReadyHandler);
		eventSource.addEventListener('gameSettings', gameSettingsHandler);
		mainEventSourceInitializedRef.current = true;

		console.log('[Main] eventSource listeners added');

		// return () => {
		// 	eventSource.removeEventListener('logout_SSE', logoutHandler);
		// 	eventSource.removeEventListener('updateUser', updateUserHandler);
		// 	eventSource.removeEventListener('enemy', enemyHandler);
		// 	eventSource.removeEventListener('gameIsReady', gameIsReadyHandler);
		// 	eventSource.removeEventListener('gameSettings', gameSettingsHandler);
		// 	eventSourceInitializedRef.current = false;
		//
		// 	// eventSource.close();
		// 	console.log('[Main] eventSource listeners removed');
		// };
	});

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
					setCurrentUser={setCurrentUser}
					status={status}
				/>
				<div className='main-center'>
					<Fade
						triggerOnce={true}
						style={{ position: 'relative', zIndex: 9 }}
					>
						<FindGame
							currentUser={currentUser}
							status={status}
							setStatus={setStatus}
							enemyRef={enemyRef}
							enemyIsReady={enemyIsReady}
						/>
					</Fade>
					<Fade
						delay={100}
						triggerOnce={true}
						style={{ position: 'relative', zIndex: 8 }}
					>
						<RecentGames/>
					</Fade>
				</div>
				<div className='main-right'>
					<Fade
						delay={100}
						triggerOnce={true}
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
