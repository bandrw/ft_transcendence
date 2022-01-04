import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { clearInterval, setInterval } from "timers";

import { useAppDispatch, useAppSelector } from "../../hook/reduxHooks";
import { ApiUpdateUser, ApiUserStatus } from "../../models/ApiTypes";
import { setStatus } from "../../store/reducers/statusSlice";

interface AcceptWindowProps {
	enemy: ApiUpdateUser;
}

export const AcceptWindow = ({ enemy }: AcceptWindowProps) => {
	const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const [timeLeft, setTimeLeft] = React.useState<number>(20);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { status } = useAppSelector((state) => state.status);
	const { enemyIsReady } = useAppSelector((state) => state.enemy);
	const dispatch = useAppDispatch();

	const declineGame = () => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
		}
		dispatch(setStatus(ApiUserStatus.Declined));
	};

	React.useEffect(() => {
		timerIntervalRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
	}, []);

	const declineGameCallback = React.useCallback(declineGame, [dispatch]);

	React.useEffect(() => {
		if (timeLeft < 0) declineGameCallback();
	}, [timeLeft, declineGameCallback]);

	return (
		<div className="accept-window-wrapper">
			<div className="accept-window">
				<p>Game is ready!</p>
				<div className="accept-window-info">
					<div className="accept-window-info-player">
						<div
							style={{
								backgroundImage: `url(${currentUser.urlAvatar})`,
								borderColor: status === ApiUserStatus.Accepted ? '#29aa44' : 'transparent',
							}}
							className="accept-window-info-img"
						/>
						<div className="accept-window-info-username">{currentUser.username}</div>
					</div>
					<div className="accept-window-info-player">
						<div
							style={{
								backgroundImage: `url(${enemy.url_avatar})`,
								borderColor: enemyIsReady ? '#29aa44' : 'transparent',
							}}
							className="accept-window-info-img"
						/>
						<div className="accept-window-info-username">{enemy ? enemy.login : '[Unknown]'}</div>
					</div>
				</div>
				<div className="accept-window-accept">
					{status === ApiUserStatus.Accepted ? (
						<div className="accept-btn accept-btn-accepted">
							<FontAwesomeIcon icon={faCheck} />
						</div>
					) : (
						<button className="accept-btn" onClick={() => dispatch(setStatus(ApiUserStatus.Accepted))}>
							Accept
						</button>
					)}
					<button className="decline-btn" onClick={declineGame}>
						Decline
					</button>
					<span>{`${timeLeft} s`}</span>
				</div>
			</div>
		</div>
	);
};