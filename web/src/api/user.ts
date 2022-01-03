import { api } from "api/api";
import {AxiosResponse} from "axios";
import {ApiUpdateUser, ApiUser, ApiUserCreate, ApiUserExpand} from "models/ApiTypes";

interface ICreateUser {
	login: string;
	pass: string;
}

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

export const getUserByLogin = (login: string) => {
	return api.get<ApiUser | null>('/users', {
			params: { login },
		})
			.then((res) => res.data);
};

export const createUser = (login: string, pass: string) => {
	return api.post<ICreateUser, AxiosResponse<ApiUserCreate>>('/users/create', {
			login,
			pass,
		})
			.then((res) => res.data);
};
