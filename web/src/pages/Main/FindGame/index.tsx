import './styles.scss';

import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { clearInterval, setInterval } from "timers";

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

	const declineGameCallback = React.useCallback(declineGame, [setStatus]);

	React.useEffect(() => {
		if (timeLeft < 0)
			declineGameCallback();
	}, [timeLeft, declineGameCallback]);

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

interface FindGameProps {
	currentUser: User,
	status: string,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemyRef: React.MutableRefObject<UpdateUser | null>,
	enemyIsReady: boolean
}

const FindGame = ({ currentUser, status, setStatus, enemyRef, enemyIsReady }: FindGameProps) => {
	const [passedTime, setPassedTime] = React.useState<number>(0);
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			return ;
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
	}, [status, currentUser, currentUser.username]);

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
