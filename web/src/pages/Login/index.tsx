import './styles.scss';

import axios, { AxiosResponse } from "axios";
import CircleLoading from "components/CircleLoading";
import { SocketContext } from "context/socket";
import { ApiUserLogin } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { Link, Redirect } from "react-router-dom";

import { getCurrentUser } from "../../App";

interface LoginProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >
}

export const signIn = async (
	login: string,
	password: string,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >,
	setErrors: React.Dispatch<React.SetStateAction<string> >,
	socketId: string
): Promise<void> => {
	const accessToken = await axios.post<any, AxiosResponse<ApiUserLogin> >('/users/login', {
		username: login,
		password: password,
		socketId: socketId
	})
		.then(res => res.data.access_token)
		.catch(() => {
			setErrors('Login Error');
			return null;
		});
	if (accessToken) {
		localStorage.setItem('access_token', accessToken);
		getCurrentUser(accessToken, socketId)
			.then(usr => {
				if (usr) {
					setCurrentUser(usr);
				} else {
					localStorage.removeItem('access_token');
				}
			});
	}
};

const Login = ({ currentUser, setCurrentUser }: LoginProps) => {
	const socket = React.useContext(SocketContext);

	const loginRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const [loginErrors, setLoginErrors] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	// React.useEffect(() => {
	// 	if (currentUser.isAuthorized())
	// 		history.push('/');
	// }, [currentUser, history]);

	// const params = new URLSearchParams(window.location.search);
	// const authCode = params.get('code');
	//
	// React.useEffect(() => {
	// 	if (authCode) {
	// 		axios.get<ApiAuthorize>('/authorize', { params: { code: authCode } })
	// 			.then(res => localStorage.setItem('authData', JSON.stringify(res.data)))
	// 			.catch(err => console.log('err: ', err))
	// 			.finally(() => history.push('/login'));
	// 	}
	// }, [authCode, history]);

	if (currentUser.isAuthorized())
		return <Redirect to='/'/>;

	return (
		<div className='login-container'>
			<h1>Login page</h1>

			<form onSubmit={ async (e) => {
				e.preventDefault();

				setIsLoading(true);

				const login = loginRef.current?.value || '';
				const password = passwordRef.current?.value || '';

				await signIn(login, password, setCurrentUser, setLoginErrors, socket.id);
				setIsLoading(false);
			} }
			>
				<input
					name='login'
					type='text'
					placeholder='Login'
					ref={ loginRef }
					defaultValue='admin'
					autoComplete='username'
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					ref={ passwordRef }
					defaultValue='123123'
					autoComplete='current-password'
				/>
				<span className='login-errors'>
					{ loginErrors }
				</span>
				<button
					type='submit'
					className='login-btn'
				>
					{
						isLoading ?
							<CircleLoading bgColor='#fff' width='35px' height='35px'/> :
							'Log in'
					}
				</button>
			</form>

			<Link
				to='/register'
				className='register-link'
			>
				Register
			</Link>

			<span className='separator'>
				Or
			</span>

			<div className='login-services'>
				<a
					className='login-service login-btn'
					href={
						`https://api.intra.42.fr/oauth/authorize/?` +
							`client_id=${process.env.REACT_APP_42_UID}&` +
							`redirect_uri=${encodeURIComponent('http://bandrw.local:3001/login')}&` +
							'response_type=code'
					}
				>
					Sign in with
					<div className='login-service-icon'/>
				</a>
			</div>
		</div>
	);
};

export default Login;
