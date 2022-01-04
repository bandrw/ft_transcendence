import './styles.scss';

import { faCog, faPlay, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import GameSettings from "components/GameSettings";
import { useAppDispatch, useAppSelector } from 'hook/reduxHooks';
import { ApiUserStatus } from 'models/ApiTypes';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { setStatus } from 'store/reducers/statusSlice';
import { clearInterval, setInterval } from 'timers';
import { getToken } from 'utils/token';

import {setLadderStatus} from "../../../api/findGame";
import { AcceptWindow } from "../../../components/AcceptWindow";

const FindGame = () => {
	const [passedTime, setPassedTime] = React.useState<number>(0);
	const [showSettings, setShowSettings] = React.useState(false);
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { status } = useAppSelector((state) => state.status);
	const { enemy } = useAppSelector((state) => state.enemy);
	const dispatch = useAppDispatch();

	// /ladder/setStatus
	React.useEffect(() => {
		if (!currentUser.isAuthorized) return;

		if (status === ApiUserStatus.FoundEnemy) {
			if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
			setPassedTime(0);

			return;
		}

		setLadderStatus(status)
			.then(() => {
				switch (status) {
					case ApiUserStatus.Regular: {
						if (timerIntervalRef.current) {
							clearInterval(timerIntervalRef.current);
						}
						setPassedTime(0);
						break;
					}
					case ApiUserStatus.Searching: {
						timerIntervalRef.current = setInterval(() => setPassedTime((prev) => prev + 1), 1000);
						break;
					}
					default: {
						break;
					}
				}
			})
			.catch(() => {});
	}, [status, currentUser]);

	// Click outside game settings
	React.useEffect(() => {
		const clickHandler = () => {
			if (showSettings)
				setShowSettings(false);
		};
		window.addEventListener('click', clickHandler);

		return () => {
			window.removeEventListener('click', clickHandler);
		};
	}, [showSettings]);

	if (status === ApiUserStatus.Searching)
		return (
			<div className="find-game main-block">
				<div className="find-game-img" />
				<div className="find-game-back">
					<div className="find-game-searching">
						<span>Searching</span>
						<span className="find-game-searching-time">{`${passedTime} s`}</span>
					</div>
					<button onClick={() => dispatch(setStatus(ApiUserStatus.Regular))} className="find-game-cancel">
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
					<button type='button' className="find-game-settings__button" onClick={() => setShowSettings((prev) => !prev)}>
						<FontAwesomeIcon icon={faCog}/>
					</button>
					{showSettings && (
						<GameSettings/>
					)}
				</div>
			</div>
		);

	if (status === ApiUserStatus.FoundEnemy || status === ApiUserStatus.Accepted)
		return (
			<div className="find-game main-block">
				<div className="find-game-img" />
				<div className="find-game-back">
					<div className="find-game-searching">
						<span>Searching</span>
						<span className="find-game-searching-time">{`${passedTime} s`}</span>
					</div>
					<button onClick={() => dispatch(setStatus(ApiUserStatus.Regular))} className="find-game-cancel">
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
				</div>
				<Fade duration={500} triggerOnce style={{ position: 'fixed' }}>
					{enemy && <AcceptWindow enemy={enemy} />}
				</Fade>
			</div>
		);

	return (
		<div className="find-game main-block">
			<div className="find-game-img" />
			<div className="find-game-back">
				<span>Find game</span>
				<button onClick={() => dispatch(setStatus(ApiUserStatus.Searching))} className="find-game-btn">
					<FontAwesomeIcon icon={faPlay} />
				</button>
				<button type='button' className="find-game-settings__button" onClick={() => setShowSettings((prev) => !prev)}>
					<FontAwesomeIcon icon={faCog}/>
				</button>
				{showSettings && (
					<GameSettings/>
				)}
			</div>
		</div>
	);
};

export default FindGame;
