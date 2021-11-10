import './styles.scss';

import axios, { AxiosResponse } from "axios";
import * as bcryptjs from 'bcryptjs';
import CircleLoading from "components/CircleLoading";
import { SocketContext } from "context/socket";
import { ApiUserLogin } from "models/apiTypes";
import { User } from "models/User";
import React from 'react';
import { Link, useHistory } from "react-router-dom";
import { Socket } from "socket.io-client";

interface LoginProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >
}

export const signIn = async (
	login: string,
	password: string,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >,
	setErrors: React.Dispatch<React.SetStateAction<string> >,
	socket: Socket
) => {
	const r = await axios.post<any, AxiosResponse<ApiUserLogin> >('/users/login', {
		login,
		socketId: socket.id
	})
		.then(res => {
			if (res.data.ok && bcryptjs.compareSync(password, res.data.msg.password)) {
				const usr = new User();
				usr.id = res.data.msg.id;
				usr.username = res.data.msg.login;
				usr.urlAvatar = res.data.msg.url_avatar;
				usr.loginDate = Date.now();
				setCurrentUser(usr);
				return true;
			}
			setErrors('Wrong username or password');
			return false;
		});
	if (!r)
		setErrors('Login error');
};

const Login = ({ currentUser, setCurrentUser }: LoginProps) => {
	const history = useHistory();
	const socket = React.useContext(SocketContext);

	const loginRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	const [loginErrors, setLoginErrors] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (currentUser.isAuthorized())
			history.push('/');
	});

	return (
		<div className='login-container'>
			<h1>Login page</h1>

			<form onSubmit={ async (e) => {
				e.preventDefault();

				setIsLoading(true);

				const login = loginRef.current?.value || '';
				const password = passwordRef.current?.value || '';

				await signIn(login, password, setCurrentUser, setLoginErrors, socket);
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
				<button
					className='login-service'
					onClick={ () => alert('not working yet') }
				>
					Sign in with
					<div className='login-service-icon'/>
				</button>
			</div>
		</div>
	);
};

export default Login;
