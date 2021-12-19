import { getToken } from 'app/token';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = axios.create({
	baseURL: API_URL,
	headers: { Authorization: `Bearer ${getToken()}` },
});

api.interceptors.request.use((config) => {
	config.headers!.Authorization = `Bearer ${getToken()}`;

	return config;
});

