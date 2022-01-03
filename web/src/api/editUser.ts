import { api } from "api/api";

export const updateAvatar = (data: { urlAvatar: string | ArrayBuffer | null }) => {
	return api.post('/users/updateAvatar', data);
};

export const uploadAvatar = (data: FormData) => {
	return api.post('/users/uploadAvatar', data);
};

export const updateUserName = (username: string, socketId: string ) => {
	return api.post('/users/updateUsername', {username, socketId});
};