import { api } from 'api/api';
import { ApiUser } from 'models/ApiTypes';

export const login = (socketId: string) => {
	return api.get<ApiUser | null>('/auth', { params: { socketId } }).then((res) => res.data);
};

export const logout = () => {
	return api.post('/users/logout');
};

export const registry = () => {};

export const getCurrentUser = (socketId: string) => {
	return api.get<ApiUser | null>('/auth', { params: { socketId } }).then((res) => res.data);
};