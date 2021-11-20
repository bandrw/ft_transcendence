import { IsString } from "class-validator";

export class AuthIntraDTO {
	@IsString()
	code: string;
}

export class AuthDTO {
	@IsString()
	socketId: string;
}