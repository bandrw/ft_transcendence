import axios from 'axios';
import { getToken } from '../app/token';
import { ApiUser } from '../models/ApiTypes';

export const api = axios.create({
	baseURL: 'https://localhost:3000',
	headers: { Authorization: `Bearer ${getToken()}` },
});

// api.interceptors()
