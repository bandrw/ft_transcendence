import { ExpandDTO } from "app.dto";
import { IsNumberString, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";

export class CreateUserDTO {
	@IsString()
	@MinLength(4)
	@MaxLength(16)
	login: string;

	@IsString()
	pass: string;
}

export class GetUsersDTO extends ExpandDTO {
	@IsOptional()
	@IsString()
	@MinLength(4)
	@MaxLength(16)
	login: string;
}

export class SubscribeHandlerDTO {
	@IsString()
	@MinLength(4)
	@MaxLength(16)
	target: string;
}

export class LoginDTO {
	@IsString()
	@MinLength(4)
	@MaxLength(16)
	username: string;

	@IsString()
	password: string;

	@IsString()
	socketId: string;

	@IsString()
	@IsOptional()
	@IsNumberString()
	@Length(4, 4)
	code: string;
}

export class UpdateAvatarDTO {
	@IsString()
	urlAvatar: string;
}

export class UpdateUsernameDTO {
	@IsString()
	username: string;
}
