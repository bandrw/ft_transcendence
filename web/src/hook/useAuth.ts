import {getToken} from "../app/token";

export const useAuth = (): boolean => !!getToken();