import './styles.scss';

import { getCurrentUser } from "App";
import { useAppDispatch } from "app/hooks";
import { setCurrentUser } from "app/reducers/currentUserSlice";
import { removeToken, setToken } from "app/token";
import axios, { AxiosResponse } from "axios";
import CircleLoading from "components/CircleLoading";
import { SocketContext } from "context/socket";
import { ApiUserLogin } from "models/ApiTypes";
import { User } from "models/User";
import React from 'react';
import { Link, useHistory } from "react-router-dom";

interface LoginProps {
	socketId: string
}

export const signIn = async (
	login: string,
	password: string,
	setCurrentUser: (usr: User) => void,
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
		setToken(accessToken);
		getCurrentUser(accessToken, socketId, 'local')
			.then(usr => {
				if (usr) {
					setCurrentUser(usr);
				} else {
					removeToken();
				}
			});
	}
};

const Login = ({ socketId }: LoginProps) => {
	const history = useHistory();
	const socket = React.useContext(SocketContext);
	const dispatch = useAppDispatch();

	const loginRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const [loginErrors, setLoginErrors] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const params = new URLSearchParams(window.location.search);
	const authCode = params.get('code');

	React.useEffect(() => {
		if (authCode) {
			getCurrentUser(authCode, socketId, 'intra')
				.then(user => {
					if (user) {
						dispatch(setCurrentUser(user));
					} else {
						removeToken();
					}
				})
				.finally(() => history.push('/login'));
		}
	}, [history, authCode, socketId, dispatch]);

	return (
		<div className='login-container'>
			<h1>Login page</h1>

			<form onSubmit={ async (e) => {
				e.preventDefault();

				setIsLoading(true);

				const login = loginRef.current?.value || '';
				const password = passwordRef.current?.value || '';

				await signIn(login, password, (usr: User) => dispatch(setCurrentUser(usr)), setLoginErrors, socket.id);
				setIsLoading(false);
			} }
			>
				<input
					name='login'
					type='text'
					placeholder='Login'
					ref={ loginRef }
					// defaultValue='admin'
					autoComplete='username'
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					ref={ passwordRef }
					// defaultValue='123123'
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
				{
					authCode
						? <div
								className='login-service login-btn'
							>
								<CircleLoading bgColor='#fff' width='35px' height='35px'/>
							</div>
						: <a
								className='login-service login-btn'
								href={
									`https://api.intra.42.fr/oauth/authorize/?` +
									`client_id=${process.env.REACT_APP_INTRA_UID}&` +
									`redirect_uri=${encodeURIComponent(`${process.env.REACT_APP_INTRA_REDIRECT}`)}&` +
									'response_type=code'
								} rel="noreferrer"
							>
								Sign in with
								<div className='login-service-icon'/>
							</a>
				}
			</div>
		</div>
	);
};

export default Login;
