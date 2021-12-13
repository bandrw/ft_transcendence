import "./styles.scss";

import { getCurrentUser } from "App";
import { useAppDispatch } from "app/hooks";
import { setCurrentUser } from "app/reducers/currentUserSlice";
import { removeToken, setToken } from "app/token";
import axios, { AxiosResponse } from "axios";
import CircleLoading from "components/CircleLoading";
import CodeVerification from "components/CodeVerification";
import { SocketContext } from "context/socket";
import { ApiUserLogin } from "models/ApiTypes";
import { User } from "models/User";
import React, { FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

interface LoginProps {
	socketId: string;
}

export const signIn = async (
	login: string,
	password: string,
	setUser: (usr: User) => void,
	setErrors: React.Dispatch<React.SetStateAction<string>>,
	socketId: string,
	setState: React.Dispatch<React.SetStateAction<"default" | "verification">> | null,
	code: string | null,
): Promise<void> => {
	const r = await axios
		.post<{ username: string; password: string; socketId: string, code: string | null }, AxiosResponse<ApiUserLogin>>("/users/login", {
			username: login,
			password,
			socketId,
			code,
		})
		.then((res) => res.data)
		.catch(() => {
			setErrors("Login Error");

			return null;
		});

	if (!r) return;
	const { access_token: accessToken, twoFactorAuthentication } = r;

	if (twoFactorAuthentication && setState) {
		setState('verification');

		return;
	}

	if (accessToken) {
		setToken(accessToken);
		getCurrentUser(accessToken, socketId, "local").then((usr) => {
			if (usr) {
				setUser(usr);
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

	const [loginInput, setLoginInput] = React.useState<string>('');
	const [passwordInput, setPasswordInput] = React.useState<string>('');

	const [loginErrors, setLoginErrors] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [state, setState] = React.useState<"default" | "verification">("default");

	const params = new URLSearchParams(window.location.search);
	const authCode = params.get("code");

	React.useEffect(() => {
		if (authCode) {
			getCurrentUser(authCode, socketId, "intra")
				.then((user) => {
					if (user) {
						dispatch(setCurrentUser(user));
					} else {
						removeToken();
					}
				})
				.finally(() => history.push("/login"));
		}
	}, [history, authCode, socketId, dispatch]);

	const loginSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setIsLoading(true);

		await signIn(
			loginInput,
			passwordInput,
			(usr: User) => dispatch(setCurrentUser(usr)),
			setLoginErrors,
			socket.id,
			setState,
			null,
		);
		setIsLoading(false);
	};

	const verifyCode = (code: string) => {

		signIn(
			loginInput,
			passwordInput,
			(usr: User) => dispatch(setCurrentUser(usr)),
			setLoginErrors,
			socket.id,
			setState,
			code,
		)
			.then();
	};

	return (
		<div className="login-container">
			{
				state === "default" &&
				<>
					<h1>Login page</h1>
					<form onSubmit={loginSubmit}>
						<input
							name="login"
							type="text"
							placeholder="Login"
							autoComplete="username"
							onChange={(e) => setLoginInput(e.target.value)}
						/>
						<input
							name="password"
							type="password"
							placeholder="Password"
							autoComplete="current-password"
							onChange={(e) => setPasswordInput(e.target.value)}
						/>
						<span className="login-errors">{loginErrors}</span>
						<button type="submit" className="login-btn">
							{isLoading ? <CircleLoading bgColor="#fff" width="35px" height="35px" /> : "Log in"}
						</button>
					</form>

					<Link to="/register" className="register-link">
						Register
					</Link>

					<span className="separator">Or</span>

					<div className="login-services">
						{
							authCode ? (
								<div className="login-service login-btn">
									<CircleLoading bgColor="#fff" width="35px" height="35px" />
								</div>
							) : (
								<a
									className="login-service login-btn"
									href={
										`https://api.intra.42.fr/oauth/authorize/?` +
										`client_id=${process.env.REACT_APP_INTRA_UID}&` +
										`redirect_uri=${encodeURIComponent(`${process.env.REACT_APP_INTRA_REDIRECT}`)}&` +
										"response_type=code"
									}
									rel="noreferrer"
								>
									Sign in with
									<div className="login-service-icon" />
								</a>
							)
						}
					</div>
				</>
			}
			{
				state === 'verification' &&
					<>
						<h1>Enter verification code</h1>
						<form onSubmit={(e) => e.preventDefault()}>
							<CodeVerification submit={verifyCode}/>
							<div style={{height: 25}}/>
							<span className="login-errors">{loginErrors}</span>
							<div style={{height: 25}}/>
							<button onClick={() => setState('default')} type='button' className='login-btn'>Back</button>
						</form>
					</>
			}
		</div>
	);
};

export default Login;
