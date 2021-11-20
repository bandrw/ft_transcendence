import { IsString } from "class-validator";

export class AddWatcherDTO {
	@IsString()
	gamerLogin: string
}
