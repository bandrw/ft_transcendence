import './styles.scss'

import axios, { AxiosResponse } from "axios";
import * as bcryptjs from 'bcryptjs';
import React from 'react';
import { Link, useHistory } from "react-router-dom";

import { UserLogin } from "../../apiTypes/apiTypes";
import { User } from "../../classes/User";
import CircleLoading from "../../components/CircleLoading";

interface LoginProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
}

export const signIn = async (
	login: string,
	password: string,
	setCurrentUser: (user: User) => void,
	setErrors: (errors: string) => void
) => {
	const r = await axios.post<any, AxiosResponse<UserLogin> >(`${process.env.REACT_APP_API_URL}/users/login`, {
		login
	})
		.then(res => {
			if (res.data.ok && bcryptjs.compareSync(password, res.data.msg.password)) {
				const usr = new User()
				usr.username = res.data.msg.login
				usr.loginDate = Date.now()
				setCurrentUser(usr)
				return true
			}
			setErrors('Wrong username or password')
			return false
		})
	if (!r)
		throw Error()
}

const Login = (props: LoginProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (props.currentUser.isAuthorized())
			history.push('/')
	}, [history, props.currentUser])

	const loginRef = React.createRef<HTMLInputElement>()
	const passwordRef = React.createRef<HTMLInputElement>()

	const [loginErrors, setLoginErrors] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	return (
		<div className='login-container'>
			<h1>Login page</h1>

			<form onSubmit={(e) => {
				e.preventDefault()

				setIsLoading(true)

				const login = loginRef.current?.value || '';
				const password = passwordRef.current?.value || ''

				signIn(login, password, props.setCurrentUser, setLoginErrors)
					.then(() => {
						setIsLoading(false)
						history.push('/')
					})
					.catch(() => {
						setIsLoading(false)
						setLoginErrors('Wrong login or password')
					})
			}}
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
				<span className='login-errors'>
					{loginErrors}
				</span>
				<button
					type='submit'
					className='login-btn'
				>
					{
						isLoading ?
							<CircleLoading bgColor='#fff' width='35px' height='35px'/> :
							<span>Log in</span>
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
					onClick={() => alert('not working yet')}
				>
					Sign in with
					<div className='login-service-icon'/>
				</button>
			</div>
		</div>
	)
}

export default Login;
