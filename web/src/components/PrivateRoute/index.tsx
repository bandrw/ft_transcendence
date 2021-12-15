import FullPageLoader from "components/FullPageLoader";
import { useAuth } from "hook/useAuth";
import React from "react";
import { Route, RouteProps } from "react-router-dom";

export const PrivateRoute = ({ children, ...rest }: RouteProps) => {
	const isAuth = useAuth();

	return (
		<Route
			{...rest}
			render={() =>
				isAuth ? (
					children
				) : (
					<FullPageLoader/> // TODO tmp
					// <Redirect
					// 	to={{
					// 		pathname: "/login",
					// 		state: { from: location },
					// 	}}
					// />
				)
			}
		/>
	);
};
