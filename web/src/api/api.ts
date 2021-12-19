import axios from 'axios';
import { getToken } from 'utils/token';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = axios.create({
	baseURL: API_URL,
});

api.interceptors.request.use((config) => {
	config.headers!.Authorization = `Bearer ${getToken()}`;

	return config;
});

