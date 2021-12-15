import { useAppSelector } from "app/hooks";

export const useAuth = (): boolean => {
	const { currentUser } = useAppSelector((state) => state.currentUser);

	return currentUser.isAuthorized;
};