export const getToken = (): string => {
	return sessionStorage.getItem('access_token') || '';
};

export const setToken = (token: string): void => {
	sessionStorage.setItem('access_token', token);
};

export const removeToken = (): void => {
	sessionStorage.removeItem('access_token');
};
