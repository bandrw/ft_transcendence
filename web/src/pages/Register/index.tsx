import './styles.scss'

import axios, { AxiosResponse } from "axios";
import * as bcryptjs from 'bcryptjs';
import React from 'react';
import { Link, useHistory } from "react-router-dom";

import { UserCheckExist, UserCreate } from "../../apiTypes/apiTypes";
import { User } from "../../classes/User";
import CircleLoading from "../../components/CircleLoading";
import { signIn } from "../Login";

const validateInput = (
	login: string,
	password: string,
	passwordConfirmation: string,
	setErrors: (error: string) => void
): boolean => {
	if (!login) {
		setErrors('Enter login')
		return false
	}
	if (!password) {
		setErrors('Enter password')
		return false
	}
	if (login.length < 4) {
		setErrors('Login is too short')
		return false
	}
	if (login.length > 16) {
		setErrors('Login is too long')
		return false
	}
	if (password.length < 6) {
		setErrors('Password is too short')
		return false
	}
	if (password !== passwordConfirmation) {
		setErrors('Passwords are not equal')
		return false
	}
	setErrors('')
	return true
}

interface RegisterProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
}

const Register = (props: RegisterProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (props.currentUser.isAuthorized())
			history.push('/')
	}, [history, props.currentUser])

	const loginRef = React.createRef<HTMLInputElement>()
	const passwordRef = React.createRef<HTMLInputElement>()
	const passwordConfirmRef = React.createRef<HTMLInputElement>()

	const [errors, setErrors] = React.useState<string>('')
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const register = async (e: React.FormEvent) => {
		e.preventDefault()

		const login = loginRef.current?.value || ''
		const password = passwordRef.current?.value || ''
		const passwordConfirm = passwordConfirmRef.current?.value || ''

		if (!validateInput(login, password, passwordConfirm, setErrors))
			return

		setIsLoading(true)
		setErrors('')
		const checkExistResponse: UserCheckExist = await axios.get<UserCheckExist>('/users/checkExist', {
			params: { login: login }
		})
			.then(res => res.data)
		if (checkExistResponse.ok) {
			setErrors('User with this login already exists')
			setIsLoading(false)
			return
		}

		const hashedPassword = await bcryptjs.hash(password, 10)
		const usersCreateResponse = await axios.post<any, AxiosResponse<UserCreate> >(
			'/users/create', {
			login: login,
			pass: hashedPassword
		})
			.then(res => res.data)
		if (usersCreateResponse.ok) {
			await signIn(login, password, props.setCurrentUser, setErrors)
				.catch(err => setErrors(err.toString()))
		} else {
			setErrors(usersCreateResponse.msg)
		}
		setIsLoading(false)
	}

	return (
		<div className='register-container'>
			<h1>Registration</h1>

			<form
				onSubmit={register}
			>
				<input
					name='login'
					type='text'
					placeholder='Login'
					ref={loginRef}
				/>
				<input
					name='password'
					type='password'
					placeholder='Password'
					ref={passwordRef}
				/>
				<input
					name='password-confirm'
					type='password'
					placeholder='Confirm password'
					ref={passwordConfirmRef}
				/>
				<span className='errors'>
					{errors}
				</span>
				<button type='submit' className='register-btn'>
					{
						isLoading ?
							<CircleLoading bgColor='#fff' width='35px' height='35px'/> :
							<span>Register</span>
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
	)
}

export default Register;
