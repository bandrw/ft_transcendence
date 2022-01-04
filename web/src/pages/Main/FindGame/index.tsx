import './styles.scss';

import { faCog, faPlay, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameSettings from "components/GameSettings";
import { useAppDispatch, useAppSelector } from 'hook/reduxHooks';
import { ApiUserStatus } from 'models/ApiTypes';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { setStatus } from 'store/reducers/statusSlice';
import { clearInterval, setInterval } from 'timers';

import {setLadderStatus} from "../../../api/game";
import { AcceptWindow } from "../../../components/AcceptWindow";
import AcceptedGame from "../../../components/FindGameStatus/AcceptedGame";
import RegularGame from "../../../components/FindGameStatus/RegularGame";
import SearchingGame from "../../../components/FindGameStatus/SearchingGame";

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

	switch (status) {
		case ApiUserStatus.Searching:
			return <SearchingGame passedTime={passedTime} setShowSettings={setShowSettings} showSettings={showSettings} />;
		case ApiUserStatus.FoundEnemy:
		case ApiUserStatus.Accepted:
			return <AcceptedGame passedTime={passedTime} enemy={enemy} />;
		default:
			return <RegularGame setShowSettings={setShowSettings} showSettings={showSettings}/>;
	}
};

export default FindGame;
