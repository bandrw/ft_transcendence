import { api } from "./api";

export const subscribe = (target: string) => {
	return api.get('/users/subscribe', {
		params: { target },
	});
};

export const unsubscribe = (target: string) => {
	return api.get('/users/unsubscribe', {
		params: { target },
	});
};