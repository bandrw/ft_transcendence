import { IsIn, IsString } from "class-validator";

export class FindGameDTO {
	@IsString()
	@IsIn(['green', 'yellow', 'orange', 'red', 'inGame', 'blue', 'offline'])
	status: string;
}
