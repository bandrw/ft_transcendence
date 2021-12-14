import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";

export class AuthIntraDTO {
	@IsString()
	code: string;

	@IsString()
	@IsOptional()
	@IsNumberString()
	@Length(4, 4)
	smsCode: string;

	@IsString()
	@IsOptional()
	intraToken: string;
}

export class AuthDTO {
	@IsString()
	socketId: string;
}

export class VerifySmsDTO {
	@IsString()
	@Length(4, 4)
	@IsNumberString()
	code: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^\+[1-9]\d{1,14}$/)
	phoneNumber: string;
}

export class SendSmsDTO {
	@IsString()
	@IsNotEmpty()
	@Matches(/^\+[1-9]\d{1,14}$/)
	phoneNumber: string;
}
