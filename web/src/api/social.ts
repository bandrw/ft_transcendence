import { api } from "api/api";

export const getWatchGame = (gamerLogin: string) => {
	console.log('gamerLogin', gamerLogin);

	return api.get('/games/watchGame', {params: { gamerLogin }});
};