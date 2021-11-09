import './styles.scss';

import axios, { AxiosResponse } from "axios";
import * as bcryptjs from 'bcryptjs';
import CircleLoading from "components/CircleLoading";
import { ApiUser, ApiUserCreate } from "models/apiTypes";
import { User } from "models/User";
import { signIn } from "pages/Login";
import React from 'react';
import { Link, Redirect } from "react-router-dom";

import { SocketContext } from "../../context/socket";

const validateInput = (
	login: string,
	password: string,
	passwordConfirmation: string,
	setErrors: React.Dispatch<React.SetStateAction<string> >
): boolean => {
	if (!login) {
		setErrors('Enter login');
		return false;
	}
	if (!password) {
		setErrors('Enter password');
		return false;
	}
	if (login.length < 4) {
		setErrors('Login is too short');
		return false;
	}
	if (login.length > 16) {
		setErrors('Login is too long');
		return false;
	}
	if (password.length < 6) {
		setErrors('Password is too short');
		return false;
	}
	if (password !== passwordConfirmation) {
		setErrors('Passwords are not equal');
		return false;
	}
	setErrors('');
	return true;
};

interface RegisterProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >
}

const Register = ({ currentUser, setCurrentUser }: RegisterProps) => {
	const socket = React.useContext(SocketContext);

	const loginRef = React.createRef<HTMLInputElement>();
	const passwordRef = React.createRef<HTMLInputElement>();
	const passwordConfirmRef = React.createRef<HTMLInputElement>();

	const [errors, setErrors] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	if (currentUser.isAuthorized())
		return <Redirect to='/'/>;

	const register = async (e: React.FormEvent) => {
		e.preventDefault();

		const login = loginRef.current?.value.trim().toLowerCase() || '';
		const password = passwordRef.current?.value.trim().toLowerCase() || '';
		const passwordConfirm = passwordConfirmRef.current?.value.trim().toLowerCase() || '';

		if (!validateInput(login, password, passwordConfirm, setErrors))
			return ;

		setIsLoading(true);
		setErrors('');
		const user = await axios.get<ApiUser>('/users', {
			params: { login: login }
		}).then(res => res).catch(err => err.response);
		if (!user) {
			setErrors('Error');
			setIsLoading(false);
			return ;
		}
		if (user.status === 200) {
			setErrors('User with this login already exists');
			setIsLoading(false);
			return ;
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const usersCreateResponse = await axios.post<any, AxiosResponse<ApiUserCreate> >(
			'/users/create', {
			login: login,
			pass: hashedPassword
		})
			.then(res => res.data);
		if (usersCreateResponse.ok) {
			await signIn(login, password, setCurrentUser, setErrors, socket)
				.catch(err => setErrors(err.toString()));
		} else {
			setErrors(usersCreateResponse.msg);
		}
		setIsLoading(false);
	};

	return (
		<div className='register-container'>
			<h1>Registration</h1>

			<form
				onSubmit={ register }
			>
				<input
					name='login'
					type='text'
					placeholder='Login'
					ref={ loginRef }
					autoComplete='username'
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					ref={ passwordRef }
					autoComplete='new-password'
				/>
				<input
					name='password-confirm'
					type='password'
					placeholder='Confirm password'
					ref={ passwordConfirmRef }
					autoComplete='new-password'
				/>
				<span className='errors'>
					{ errors }
				</span>
				<button type='submit' className='register-btn'>
					{
						isLoading ?
							<CircleLoading bgColor='#fff' width='35px' height='35px'/> :
							'Register'
					}
				</button>
			</form>

			<span className='separator'>
				Or
			</span>

			<Link className='register-link' to='/login'>
				Sign in
			</Link>
		</div>
	);
};

export default Register;
