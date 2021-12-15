import { getToken } from 'app/token';
import axios from 'axios';

export const api = axios.create({
	baseURL: 'https://localhost:3000',
	headers: { Authorization: `Bearer ${getToken()}` },
});

// api.interceptors()
