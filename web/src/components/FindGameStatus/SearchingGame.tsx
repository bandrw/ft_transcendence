import { faCog, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GameSettings from "components/GameSettings";
import { useAppDispatch } from "hook/reduxHooks";
import { ApiUserStatus } from "models/ApiTypes";
import React from 'react';
import { setStatus } from "store/reducers/statusSlice";

interface SearchingGameProps {
	passedTime: number;
	showSettings: boolean;
	setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export const SearchingGame = ({ passedTime, showSettings, setShowSettings }: SearchingGameProps) => {
	const dispatch = useAppDispatch();

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
};

export default SearchingGame;
