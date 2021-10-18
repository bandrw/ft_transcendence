import './styles.scss';

import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateUser, UserStatus } from "apiTypes/apiTypes";
import axios from "axios";
import { User } from "models/User";
import React from 'react';
import { clearInterval, setInterval } from "timers";

interface FindGameProps {
	currentUser: User,
	status: string,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>
}

interface AcceptWindowProps {
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemy: UpdateUser | null,
	enemyIsReady: boolean
}

const AcceptWindow = ({ status, setStatus, enemy, enemyIsReady }: AcceptWindowProps) => {
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const [timeLeft, setTimeLeft] = React.useState<number>(20);

	const acceptGame = () => {
		if (timerIntervalRef.current)
			clearInterval(timerIntervalRef.current);
		setStatus(UserStatus.Accepted);

	};

	const declineGame = () => {
		if (timerIntervalRef.current)
			clearInterval(timerIntervalRef.current);
		setStatus(UserStatus.Declined);
	};

	React.useEffect(() => {
		timerIntervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

		return () => {
			if (timerIntervalRef.current)
				clearInterval(timerIntervalRef.current);
		};
	}, []);

	React.useEffect(() => {
		if (timeLeft < 0)
			declineGame();
	}, [timeLeft]);

	return (
		<div className='accept-window-wrapper'>
			<div className='accept-window'>
				<p>Game is ready!</p>
				<div>{enemy ? enemy.login : 'null'}</div>
				<div>{enemyIsReady ? 'He is ready' : 'He is not ready yet'}</div>
				<div className='accept-window-accept'>
					<button
						className='accept-btn'
						onClick={acceptGame}
					>
						{status === UserStatus.Accepted ? 'Accepted, nice!' : 'Accept'}
					</button>
					<button className='decline-btn' onClick={declineGame}>Decline</button>
					<span>{`${timeLeft} s`}</span>
				</div>
			</div>
		</div>
	);
};

const FindGame = ({ currentUser, status, setStatus }: FindGameProps) => {
	const [passedTime, setPassedTime] = React.useState<number>(0);
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const enemyRef = React.useRef<UpdateUser | null>(null);
	const [enemyIsReady, setEnemyIsReady] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (status === UserStatus.InGame) {
			return ;
		}
		if (status === UserStatus.FoundEnemy) {
			if (timerIntervalRef.current)
				clearInterval(timerIntervalRef.current);
			setPassedTime(0);
			return ;
		}
		axios.get('/ladder/gameStatus', {
			params: {
				login: currentUser.username,
				status: status
			}
		}).then(() => {
			console.log('status changed to ' + status);
			switch (status) {
				case UserStatus.Regular: {
					if (timerIntervalRef.current)
						clearInterval(timerIntervalRef.current);
					setPassedTime(0);
					break;
				}
				case UserStatus.Searching: {
					timerIntervalRef.current = setInterval(() => setPassedTime(prev => prev + 0.1), 100);
					break;
				}
			}
		});
	}, [status, currentUser.username]);

	const updateUserHandler = (e: any) => {
		const data: UpdateUser = JSON.parse(e.data);
		console.log('[updateUserHandler]', data, enemyRef.current);
		if (!enemyRef.current && status !== UserStatus.Regular) {
			setStatus(UserStatus.Regular);
			console.log('[1] status set to ' + UserStatus.Regular);
		} else if (enemyRef.current && data.login === enemyRef.current.login && (data.status === UserStatus.Declined || data.status === UserStatus.Regular)) {
			setStatus(UserStatus.Regular);
			console.log('[2] status set to ' + UserStatus.Regular);
		} else if (enemyRef.current && data.login === enemyRef.current.login && data.status === UserStatus.Accepted) {
			setEnemyIsReady(true);
		}
	};

	const enemyHandler = (e: any) => {
		const data: UpdateUser  = JSON.parse(e.data);
		console.log('[enemyHandler]', data);
		enemyRef.current = data;
		setStatus(UserStatus.FoundEnemy);
		console.log('[3] status set to ' + UserStatus.FoundEnemy);
	};

	const enemyIsReadyHandler = () => {
		console.log('[enemyIsReadyHandler]');
	};

	const gameIsReadyHandler = () => {
		console.log('[gameIsReadyHandler]');
		setStatus(UserStatus.InGame);
	};

	React.useEffect(() => {
		if (!process.env.REACT_APP_API_URL)
			throw Error('REACT_APP_API_URL is empty');
		const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/users/login?login=${currentUser.username}`);

		eventSource.addEventListener('updateUser', updateUserHandler);
		eventSource.addEventListener('enemy', enemyHandler);
		eventSource.addEventListener('enemyIsReady', enemyIsReadyHandler);
		eventSource.addEventListener('gameIsReady', gameIsReadyHandler);

		console.log('eventSource listeners added');

		return () => {
			eventSource.removeEventListener('updateUser', updateUserHandler);
			eventSource.removeEventListener('enemy', enemyHandler);
			eventSource.removeEventListener('enemyIsReady', enemyIsReadyHandler);
			eventSource.removeEventListener('gameIsReady', gameIsReadyHandler);

			eventSource.close();
			console.log('eventSource listeners removed');
		};
	}, []);

	if (status === UserStatus.Searching)
		return (
			<div className='find-game'>
				<div className='find-game-searching'>
					<span>Searching</span>
					<span className='find-game-searching-time'>{`${passedTime.toFixed(1)} s`}</span>
				</div>
				<button
					onClick={() => setStatus(UserStatus.Regular)}
					className='find-game-cancel'
				>
					<FontAwesomeIcon icon={faTimesCircle}/>
				</button>
			</div>
		);

	if (status === UserStatus.FoundEnemy || status === UserStatus.Accepted)
		return (
			<div className='find-game'>
				<AcceptWindow
					status={status}
					setStatus={setStatus}
					enemy={enemyRef.current}
					enemyIsReady={enemyIsReady}
				/>
			</div>
		);

	return (
		<div className='find-game'>
			<button
				onClick={() => setStatus(UserStatus.Searching)}
				className='find-game-btn'
			>
				Find game
			</button>
		</div>
	);
};

export default FindGame;
