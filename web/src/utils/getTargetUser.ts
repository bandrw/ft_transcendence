import {ApiUserExpand} from "../models/ApiTypes";
import {Nullable} from "../models/Nullable";

export const getTargetUser = (allUsers: ApiUserExpand[], target: Nullable<number>, field: string) => {
	return allUsers.find((user) => user[field] === target);
};