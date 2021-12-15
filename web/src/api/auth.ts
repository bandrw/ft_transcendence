import { ApiUser } from '../models/ApiTypes';
import { api } from './api';

export const login = (socketId: string) => {
	return api.get<ApiUser | null>('/auth', { params: { socketId } }).then((res) => res.data);
};

export const registry = () => {};
