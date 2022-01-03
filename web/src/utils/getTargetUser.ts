import {ApiUserExpand} from "../models/ApiTypes";
import {Nullable} from "../models/Nullable";

export const getTargetUser = <T>(allUsers: ApiUserExpand[], target: Nullable<T>, field: string) => {
	return allUsers.find((user) => user[field] === target);
};