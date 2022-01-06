import './styles.scss';

import { signIn } from 'api/auth';
import {createUser, getUserByLogin} from "api/user";
import * as bcryptjs from 'bcryptjs';
import CircleLoading from 'components/CircleLoading';
import {useAppDispatch, useAppSelector} from 'hook/reduxHooks';
import React, {useEffect} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import { Link } from 'react-router-dom';
import { setCurrentUser } from 'store/reducers/currentUserSlice';

interface IRegisterForm {
	login: string;
	password: string;
	passwordConfirm: string;
}

const Register = () => {
	const { socket } = useAppSelector((state) => state.socket);

	const [errorMessage, setErrorMessage] = React.useState<string>('');
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const { register, handleSubmit, setError, formState: { errors } } = useForm<IRegisterForm>();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (errors.login) {
			return setErrorMessage(errors.login.message || 'Error');
		}

		if (errors.password) {
			return setErrorMessage(errors.password.message || 'Error');
		}

		if (errors.passwordConfirm) {
			return setErrorMessage(errors.passwordConfirm.message || 'Error');
		}
	}, [errors]);

	const onSubmit: SubmitHandler<IRegisterForm> = async ({ login, password, passwordConfirm }) => {
		login = login.trim().toLowerCase();

		if (login.length < 4)
			return setError('login', { type: 'manual', message: 'Login is too short' });

		if (login.length > 16)
			return setError('login', { type: 'manual', message: 'Login is too long' });

		if (password.length < 6)
			return setError('password', { type: 'manual', message: 'Password is too short' });

		if (password !== passwordConfirm)
			return setError('passwordConfirm', { type: 'manual', message: 'Passwords are not equal' });

		setIsLoading(true);
		const user = await getUserByLogin(login);

		if (user) {
			setErrorMessage('User with this login already exists');
			setIsLoading(false);

			return;
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const usersCreateResponse = await createUser(login, hashedPassword);

		if (usersCreateResponse.ok) {
			try {
				await signIn(
					login,
					password,
					(usr) => dispatch(setCurrentUser(usr)),
					setErrorMessage,
					socket.id,
					null,
					null,
				);
			} catch (err) {
				setErrorMessage(`${err}`);
			}
		} else {
			setErrorMessage(usersCreateResponse.msg);
		}
		setIsLoading(false);
	};

	return (
		<div className="register-container">
			<h1>Registration</h1>

			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					type="text"
					placeholder="Login"
					autoComplete="username"
					{...register('login', { required: true })}
				/>
				<input
					type="password"
					placeholder="Password"
					autoComplete="new-password"
					{...register('password', { required: true })}
				/>
				<input
					type="password"
					placeholder="Confirm password"
					autoComplete="new-password"
					{...register('passwordConfirm', { required: true })}
				/>
				{ errorMessage && <span className="errors">{errorMessage}</span> }
				<button type="submit" className="register-btn">
					{isLoading ? <CircleLoading bgColor="#fff" width="35px" height="35px" /> : 'Register'}
				</button>
			</form>

			<span className="separator">Or</span>

			<Link className="register-link" to="/login">
				Sign in
			</Link>
		</div>
	);
};

export default Register;
