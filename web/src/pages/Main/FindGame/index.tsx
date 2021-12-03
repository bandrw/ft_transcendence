import './styles.scss';

import { faCheck, faPlay, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStatus } from "app/reducers/statusSlice";
import axios from "axios";
import { ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import React from 'react';
import { Fade } from "react-awesome-reveal";
import { clearInterval, setInterval } from "timers";

interface AcceptWindowProps {
	enemy: ApiUpdateUser,
	enemyIsReady: boolean
}

const AcceptWindow = ({ enemy, enemyIsReady }: AcceptWindowProps) => {
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const [timeLeft, setTimeLeft] = React.useState<number>(20);
	const { currentUser } = useAppSelector(state => state.currentUser);
	const { status } = useAppSelector(state => state.status);
	const dispatch = useAppDispatch();

	const declineGame = () => {
		if (timerIntervalRef.current)
			clearInterval(timerIntervalRef.current);
		dispatch(setStatus(ApiUserStatus.Declined));
	};

	React.useEffect(() => {
		timerIntervalRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

		return () => {
			if (timerIntervalRef.current)
				clearInterval(timerIntervalRef.current);
		};
	}, []);

	const declineGameCallback = React.useCallback(declineGame, [dispatch]);

	React.useEffect(() => {
		if (timeLeft < 0)
			declineGameCallback();
	}, [timeLeft, declineGameCallback]);

	return (
		<div className='accept-window-wrapper'>
			<div className='accept-window'>
				<p>Game is ready!</p>
				<div className='accept-window-info'>
					<div className='accept-window-info-player'>
						<div
							style={ {
								backgroundImage: `url(${currentUser.urlAvatar})`,
								borderColor: status === ApiUserStatus.Accepted ? '#29aa44' : 'transparent'
							} }
							className='accept-window-info-img'
						/>
						<div className='accept-window-info-username'>{ currentUser.username }</div>
					</div>
					<div className='accept-window-info-player'>
						<div
							style={ {
								backgroundImage: `url(${enemy.url_avatar})`,
								borderColor: enemyIsReady ? '#29aa44' : 'transparent'
							} }
							className='accept-window-info-img'
						/>
						<div className='accept-window-info-username'>{ enemy ? enemy.login : '[Unknown]' }</div>
					</div>
				</div>
				<div className='accept-window-accept'>
					{
						status === ApiUserStatus.Accepted
							? <div className='accept-btn accept-btn-accepted'>
									<FontAwesomeIcon icon={ faCheck }/>
								</div>
							: <button className='accept-btn' onClick={ () => dispatch(setStatus(ApiUserStatus.Accepted)) }>
									Accept
								</button>
					}
					<button className='decline-btn' onClick={ declineGame }>Decline</button>
					<span>{ `${timeLeft} s` }</span>
				</div>
			</div>
		</div>
	);
};

interface FindGameProps {
	enemyIsReady: boolean
}

const FindGame = ({ enemyIsReady }: FindGameProps) => {
	const [passedTime, setPassedTime] = React.useState<number>(0);
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const { currentUser } = useAppSelector(state => state.currentUser);
	const { status } = useAppSelector(state => state.status);
	const { enemy } = useAppSelector(state => state.enemy);
	const dispatch = useAppDispatch();

	React.useEffect(() => {
		let isMounted = true;

		if (!currentUser.isAuthorized())
			return ;

		if (status === ApiUserStatus.FoundEnemy) {
			if (timerIntervalRef.current)
				clearInterval(timerIntervalRef.current);
			setPassedTime(0);
			return ;
		}
		axios.get('/ladder/setStatus', {
			params: { status: status },
			headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
		})
			.then(() => {
				if (!isMounted)
					return ;

				switch (status) {
					case ApiUserStatus.Regular: {
						if (timerIntervalRef.current)
							clearInterval(timerIntervalRef.current);
						setPassedTime(0);
						break;
					}
					case ApiUserStatus.Searching: {
						timerIntervalRef.current = setInterval(() => setPassedTime(prev => prev + 1), 1000);
						break;
					}
				}
			})
			.catch(() => {});

		return () => {
			isMounted = false;
		};
	}, [status, currentUser]);

	if (status === ApiUserStatus.Searching)
		return (
			<div className='find-game main-block'>
				<div className='find-game-img'/>
				<div className='find-game-back'>
					<div className='find-game-searching'>
						<span>Searching</span>
						<span className='find-game-searching-time'>{ `${passedTime} s` }</span>
					</div>
					<button
						onClick={ () => dispatch(setStatus(ApiUserStatus.Regular)) }
						className='find-game-cancel'
					>
						<FontAwesomeIcon icon={ faTimesCircle }/>
					</button>
				</div>
			</div>
		);

	if (status === ApiUserStatus.FoundEnemy || status === ApiUserStatus.Accepted)
		return (
			<div className='find-game main-block'>
				<div className='find-game-img'/>
				<div className='find-game-back'>
					<div className='find-game-searching'>
						<span>Searching</span>
						<span className='find-game-searching-time'>{ `${passedTime} s` }</span>
					</div>
					<button
						onClick={ () => dispatch(setStatus(ApiUserStatus.Regular)) }
						className='find-game-cancel'
					>
						<FontAwesomeIcon icon={ faTimesCircle }/>
					</button>
				</div>
				<Fade
					duration={ 500 }
					triggerOnce={ true }
					style={ { position: 'fixed' } }
				>
					{
						enemy &&
						<AcceptWindow
							enemy={ enemy }
							enemyIsReady={ enemyIsReady }
						/>
					}
				</Fade>
			</div>
		);

	return (
		<div className='find-game main-block'>
			<div className='find-game-img'/>
			<div className='find-game-back'>
				<span>Find game</span>
				<button
					onClick={ () => dispatch(setStatus(ApiUserStatus.Searching)) }
					className='find-game-btn'
				>
					<FontAwesomeIcon icon={ faPlay }/>
				</button>
			</div>
		</div>
	);
};

export default FindGame;
