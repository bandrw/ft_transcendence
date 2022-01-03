import { useAuth } from "hook/useAuth";
import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { AppDataLayout } from "../../Layout/AppDataLayout";

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
	const isAuth = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				isAuth ? (
					<AppDataLayout>{children}</AppDataLayout>
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
