import { ApiUserStatus } from "models/ApiTypes";

import { api } from './api';

export const setLadderStatus = (status:  ApiUserStatus) => {
	return api.get('/ladder/setStatus', {
		params: { status },
	});
};
