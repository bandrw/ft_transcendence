import { useAppSelector } from "hook/reduxHooks";

export const useAuth = (): boolean => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	return currentUser.isAuthorized;
};
