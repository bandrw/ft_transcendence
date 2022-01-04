import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from 'react';
import {Fade} from "react-awesome-reveal";

import {useAppDispatch} from "../../hook/reduxHooks";
import {ApiUpdateUser, ApiUserStatus} from "../../models/ApiTypes";
import {setStatus} from "../../store/reducers/statusSlice";
import {AcceptWindow} from "../AcceptWindow";

interface AcceptedGameProps {
	passedTime: number;
	enemy: ApiUpdateUser | null
}

const AcceptedGame = ({ passedTime, enemy }: AcceptedGameProps) => {
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
			</div>
			<Fade duration={500} triggerOnce style={{ position: 'fixed' }}>
				{enemy && <AcceptWindow enemy={enemy} />}
			</Fade>
		</div>
	);
};

export default AcceptedGame;