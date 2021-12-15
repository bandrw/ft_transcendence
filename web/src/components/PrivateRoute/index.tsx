import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useAuth } from "../../hook/useAuth";

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
	const isAuth = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				isAuth ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};