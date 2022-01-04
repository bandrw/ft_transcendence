import { faCog, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSettings from "components/GameSettings";
import { useAppDispatch } from "hook/reduxHooks";
import { ApiUserStatus } from "models/ApiTypes";
import React from 'react';
import { setStatus } from "store/reducers/statusSlice";

interface RegularGameProps {
	showSettings: boolean;
	setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
}

const RegularGame = ({ showSettings , setShowSettings}: RegularGameProps) => {
	const dispatch = useAppDispatch();

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

export default RegularGame;
