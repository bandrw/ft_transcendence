import {faGamepad} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from 'react';
import { useParams } from "react-router-dom";

import {useAppSelector} from "../../hook/reduxHooks";
import { ApiGame } from "../../models/ApiTypes";
import {getTargetUser} from "../../utils/getTargetUser";
import GameItem from "../GameItem";

interface GameListProps {
	gamesHistory: ApiGame[];
}

export const GameList = ({ gamesHistory }: GameListProps) => {
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const params = useParams<{ login: string }>();

	if (gamesHistory.length === 0) {
		return (
			<div className="list-section-empty">
				No games yet
				<FontAwesomeIcon icon={faGamepad} />
			</div>
		);
	}

	return (
		<>
			{gamesHistory.slice(0, 3).map((game) => {
				const loser = getTargetUser(allUsers, game.loserId, 'id'); // allUsers.find((usr) => usr.id === game.loserId);
				const winner = getTargetUser(allUsers, game.winnerId, 'id'); // allUsers.find((usr) => usr.id === game.winnerId);

				return (
					<GameItem
						key={game.loserId}
						game={game}
						user={winner?.login === params.login ? winner : loser}
						enemy={loser?.login === params.login ? winner : loser}
					/>
				);
			})}
		</>
	);
};

export default GameList;