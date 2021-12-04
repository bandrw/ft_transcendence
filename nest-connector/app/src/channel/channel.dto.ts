import {
	IsBoolean, IsIn,
	IsNumber, IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf
} from "class-validator";

export class CreateChannelDTO {
	@MinLength(4)
	@MaxLength(16)
	@IsString()
	name: string;

	@IsString()
	title: string;

	@IsBoolean()
	isPrivate: boolean;

	@ValidateIf(o => o.isPrivate)
	@IsString()
	password: string;
}

export class JoinChannelDTO {
	@IsNumber()
	channelId: number;

	@IsOptional()
	@IsString()
	password: string;
}

export class UpdateMemberStatusDTO {
	@IsNumber()
	channelId: number;

	@IsNumber()
	memberId: number;

	@IsString()
	@IsIn(['member', 'admin'])
	status: string;
}
