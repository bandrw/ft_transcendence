import { api } from "./api";

export const getWatchGame = (gamerLogin: string) => {
	return api.get('/games/watchGame', {params: { gamerLogin }});
};
