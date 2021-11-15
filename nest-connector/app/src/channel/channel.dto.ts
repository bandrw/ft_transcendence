import {
	IsAlphanumeric,
	IsBoolean,
	IsBooleanString, IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf
} from "class-validator";

export class CreateChannelDTO {
	@IsAlphanumeric()
	@MinLength(4)
	@MaxLength(16)
	@IsString()
	name: string; // todo [ name can contain '_' ]

	@IsString()
	title: string;

	@IsBoolean()
	isPrivate: boolean;

	@ValidateIf(o => o.isPrivate)
	@IsString()
	password: string;
}

// export class GetChannelsDTO {
// 	@IsOptional()
// 	@IsBooleanString()
// 	expand: boolean;
// }

export class JoinChannelDTO {
	@IsNumber()
	channelId: number;
}