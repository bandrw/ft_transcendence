import { ApiGame } from "../models/ApiTypes";

export const getGameHistory = (wonGames: ApiGame[], lostGames: ApiGame[]) =>
	wonGames
		.concat(lostGames)
		.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));