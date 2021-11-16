import { IsEmpty, IsOptional } from "class-validator";

export class ExpandDTO {
	@IsOptional()
	@IsEmpty()
	expand: string;
}

export class EmptyDTO {}
