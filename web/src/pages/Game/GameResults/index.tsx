import './styles.scss';

import { faChevronLeft, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch } from "app/hooks";
import { setStatus } from "app/reducers/statusSlice";
import { ApiUserStatus } from "models/ApiTypes";
import React from "react";
import { useHistory } from "react-router-dom";

interface GameResultsProps {
	winner: string,
	loser: string,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
}

const GameResults = ({ winner, loser, gameRef }: GameResultsProps) => {
	const history = useHistory();
	const dispatch = useAppDispatch();

	return (
		<div className='game-results'>
			<p>Game over</p>
			<div className='game-results-winner'>
				<div>
					<FontAwesomeIcon icon={ faTrophy }/>
					Winner:
				</div>
				<span>{ winner }</span>
			</div>
			<div className='game-results-loser'>
				<div>
					Loser:
				</div>
				<span>{ loser }</span>
			</div>
			<div className='game-results-buttons'>
				<button
					className='game-results-back-btn'
					onClick={ () => {
						dispatch(setStatus(ApiUserStatus.Regular));
						gameRef.current.runs = false;
						history.push('/');
					} }
				>
					<FontAwesomeIcon icon={ faChevronLeft }/>
					Main menu
				</button>
			</div>
		</div>
	);
};

export default GameResults;
