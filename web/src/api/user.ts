import { ApiUser, ApiUserExpand } from "../models/ApiTypes";
import { api } from "./api";

export const getCurrentUser = (socketId: string) => {
	return api.get<ApiUser | null>('/auth', { params: { socketId } }).then((res) => res.data);
};

export const fetchAllUsers = () => {
	return api
		.get<ApiUserExpand[]>('/users', {
			params: { expand: '' },
		})
		.then((res) => res.data);
};