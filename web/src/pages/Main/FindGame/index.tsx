import './styles.scss';

import { faCheck, faPlay, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { UpdateUser, UserStatus } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { Fade } from "react-awesome-reveal";
import { clearInterval, setInterval } from "timers";

interface AcceptWindowProps {
	currentUser: User,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus>>,
	enemy: UpdateUser | null,
	enemyIsReady: boolean
}

const AcceptWindow = ({ currentUser, status, setStatus, enemy, enemyIsReady }: AcceptWindowProps) => {
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

	if (!enemy)
		throw Error('No enemy');

	return (
		<div className='accept-window-wrapper'>
			<div className='accept-window'>
				<p>Game is ready!</p>
				<div className='accept-window-info'>
					<div className='accept-window-info-player'>
						<div
							style={{
								backgroundImage: `url(${currentUser.urlAvatar})`,
								borderColor: status === UserStatus.Accepted ? '#29aa44' : 'transparent'
							}}
							className='accept-window-info-img'
						/>
						<div className='accept-window-info-username'>{currentUser.username}</div>
					</div>
					<div className='accept-window-info-player'>
						<div
							style={{
								backgroundImage: `url(${enemy.url_avatar})`,
								borderColor: enemyIsReady ? '#29aa44' : 'transparent'
							}}
							className='accept-window-info-img'
						/>
						<div className='accept-window-info-username'>{enemy ? enemy.login : '[Unknown]'}</div>
					</div>
				</div>
				<div className='accept-window-accept'>
					{
						status === UserStatus.Accepted
							? <div className='accept-btn accept-btn-accepted'>
									<FontAwesomeIcon icon={faCheck}/>
								</div>
							: <button className='accept-btn' onClick={acceptGame}>
									Accept
								</button>
					}
					<button className='decline-btn' onClick={declineGame}>Decline</button>
					<span>{`${timeLeft} s`}</span>
				</div>
			</div>
		</div>
	);
};

interface FindGameProps {
	currentUser: User,
	status: UserStatus,
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
					timerIntervalRef.current = setInterval(() => setPassedTime(prev => prev + 1), 1000);
					break;
				}
			}
		});
	}, [status, currentUser, currentUser.username]);

	if (status === UserStatus.Searching)
		return (
			<div className='find-game main-block'>
				<div className='find-game-img'/>
				<div className='find-game-back'>
					<div className='find-game-searching'>
						<span>Searching</span>
						<span className='find-game-searching-time'>{`${passedTime} s`}</span>
					</div>
					<button
						onClick={() => setStatus(UserStatus.Regular)}
						className='find-game-cancel'
					>
						<FontAwesomeIcon icon={faTimesCircle}/>
					</button>
				</div>
			</div>
		);

	if (status === UserStatus.FoundEnemy || status === UserStatus.Accepted)
		return (
			<Fade
				className='find-game main-block'
				style={{ animationFillMode: 'backwards' }}
			>
				<AcceptWindow
					currentUser={currentUser}
					status={status}
					setStatus={setStatus}
					enemy={enemyRef.current}
					enemyIsReady={enemyIsReady}
				/>
			</Fade>
		);

	return (
		<div className='find-game main-block'>
			<div className='find-game-img'/>
			<div className='find-game-back'>
				<span>Find game</span>
				<button
					onClick={() => setStatus(UserStatus.Searching)}
					className='find-game-btn'
				>
					<FontAwesomeIcon icon={faPlay}/>
				</button>
			</div>
		</div>
	);
};

export default FindGame;
