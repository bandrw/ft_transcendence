import { ApiUpdateUser, ApiUser, ApiUserExpand } from "../models/ApiTypes";
import { api } from "./api";

export const getCurrentUser = (socketId: string) => {
	return api.get<ApiUser | null>('/auth', { params: { socketId } }).then((res) => res.data);
};

export const getAllUsers = () => {
	return api
		.get<ApiUserExpand[]>('/users', {
			params: { expand: '' },
		})
		.then((res) => res.data);
};

export const getOnlineUsers = () => {
 	return api.get<ApiUpdateUser[]>('/users/online').then((res) => res.data);
};