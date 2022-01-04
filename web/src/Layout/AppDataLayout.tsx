import FullPageLoader from "components/FullPageLoader";
import {useAppDispatch, useAppSelector} from "hook/reduxHooks";
import {ApiGameSettings, ApiUpdateUser, ApiUserStatus} from "models/ApiTypes";
import React, {FC, useEffect} from 'react';
import {getAllUsersAction} from "store/reducers/allUsersSlice";
import {getCurrentUserAction, setCurrentUser} from "store/reducers/currentUserSlice";
import {setEnemy, setEnemyIsReady} from "store/reducers/enemySlice";
import {setGameSettings} from "store/reducers/gameSlice";
import {getOnlineUsersAction, removeOnlineUser, setOnlineUsers} from "store/reducers/onlineUsersSlice";
import {setStatus} from "store/reducers/statusSlice";

import MainLayout from "./MainLayout";

export interface LayoutProps {
	children: React.ReactNode;
}

type AppDataLayoutProps = LayoutProps


export const AppDataLayout: FC<AppDataLayoutProps> = ({ children }) => {
	const {socket, socket: { id: socketId }} = useAppSelector((state) => state.socket);

	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { onlineUsers } = useAppSelector((state) => state.onlineUsers);
	const { status } = useAppSelector((state) => state.status);
	const { enemy } = useAppSelector((state) => state.enemy);
	const dispatch = useAppDispatch();

	// Fetching onlineUsers
	useEffect(() => {
		dispatch(getOnlineUsersAction());
	}, [dispatch]);

	// Fetching allUsers + updating on onlineUsers change
	useEffect(() => {
		dispatch(getAllUsersAction());
	}, [dispatch, onlineUsers]);

	// Getting user from access_token
	useEffect(() => {
		if (socketId) {
			dispatch(getCurrentUserAction(socketId));
		}
	}, [dispatch, socketId]);


	// Event handlers
	useEffect(() => {
		const logoutHandler = (data: string) => {
			const logoutData: ApiUpdateUser = JSON.parse(data);
			dispatch(removeOnlineUser(logoutData));
		};

		const gameSettingsHandler = (e: string) => {
			const gameSettings: ApiGameSettings = JSON.parse(e);
			dispatch(setGameSettings(gameSettings));

			// If watch mode is on, don't send start
			if (
				gameSettings.leftPlayer.login !== currentUser.username &&
				gameSettings.rightPlayer.login !== currentUser.username
			) {
				return;
			}

			const data = {
				login: currentUser.username,
				id: gameSettings.id,
			};
			setTimeout(() => socket.emit('start', JSON.stringify(data)), 3000);
		};

		const updateUserHandler = (data: string) => {
			const updateUserData: ApiUpdateUser[] = JSON.parse(data);

			dispatch(setOnlineUsers(updateUserData));

			// Update currentUser
			const currUsr = updateUserData.find((usr) => usr.id === currentUser.id);

			if (currUsr) {
				currentUser.username = currUsr.login;
				currentUser.urlAvatar = currUsr.url_avatar;
				dispatch(setCurrentUser(currentUser));
			}

			if (enemy) {
				const enemyData = updateUserData.find((usr) => usr.id === enemy.id);

				if (enemyData)
					dispatch(setEnemy(enemyData));

				if (!enemyData) return;

				const enemyDeclinedGame =
					enemyData.status === ApiUserStatus.Declined || enemyData.status === ApiUserStatus.Regular;
				const enemyAcceptedGame = enemyData.status === ApiUserStatus.Accepted;

				if (enemyDeclinedGame) {
					dispatch(setStatus(ApiUserStatus.Regular));
					dispatch(setEnemyIsReady(false));
					dispatch(setEnemy(null));
				} else if (enemyAcceptedGame) {
					dispatch(setEnemyIsReady(true));
				}
			}
		};

		const enemyHandler = (e: string) => {
			const enemyData: ApiUpdateUser = JSON.parse(e);
			dispatch(setEnemy(enemyData));
			dispatch(setStatus(ApiUserStatus.FoundEnemy));
		};

		const gameIsReadyHandler = () => {
			dispatch(setStatus(ApiUserStatus.InGame));
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
	}, [currentUser, socket, onlineUsers, dispatch, status, enemy]);

	return (
		<>{currentUser.username ? <MainLayout>{children}</MainLayout> : <FullPageLoader />}</>
	);
};
